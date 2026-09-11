import { useEffect, useMemo, useState } from 'react';
import { canOfferInstall, useInstall } from '../../install';
import { HowToPlay } from '../components/HowToPlay';
import { CARDS, dailySeed, dailyStreakAlive, dailyWeather, dayCard, daylight, STREAK_FOR_WEEK_CARD, moonName, moonPhase, weeklySeed, weeklyWeather, DEPTHS, DESCENTS, getCard, getDescent, maxDepthUnlocked } from '../../engine';
import { CardBack, type BackVariant } from '../art/CardArt';
import { WeatherArt } from '../art/weather';
import { StreakFlames } from '../art/flames';
import { TitleSky } from '../art/sky';
import { ReaderMark } from '../components/ReaderMark';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const FAN_IDS = ['major-17', 'major-18', 'major-16', 'major-0', 'major-19'];

/** What the hour is called on the title's sky line. */
const LIGHT_WORDS = { dawn: 'first light', day: 'full daylight', dusk: 'dusk coming on', night: 'deep night' } as const;

export function TitleScreen() {
  const newRun = useGame((s) => s.newRun);
  const newDaily = useGame((s) => s.newDaily);
  const newWeekly = useGame((s) => s.newWeekly);
  const saved = useGame((s) => s.saved);
  const resume = useGame((s) => s.resume);
  const abandon = useGame((s) => s.abandon);
  const goto = useGame((s) => s.goto);
  const k = useGame((s) => s.knowledge);
  const descent = useGame((s) => s.descent);
  const setDescent = useGame((s) => s.setDescent);
  const depth = useGame((s) => s.depth);
  const setDepth = useGame((s) => s.setDepth);
  const maxDepth = maxDepthUnlocked(k.records?.standard?.returns ?? 0);
  const [lockedNote, setLockedNote] = useState<string | null>(null);
  const [fanDown, setFanDown] = useState(false);
  const [todayOpen, setTodayOpen] = useState(false);
  // Foil shimmer follows device tilt where the browser allows it without a prompt, else the pointer.
  useEffect(() => {
    const root = document.documentElement;
    const set = (x: number) => root.style.setProperty('--shimmer', `${Math.max(0, Math.min(100, x))}%`);
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      set(50 + (e.gamma / 45) * 50);
    };
    const onMove = (e: PointerEvent) => set((e.clientX / window.innerWidth) * 100);
    window.addEventListener('deviceorientation', onTilt);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('pointermove', onMove);
      root.style.removeProperty('--shimmer');
    };
  }, []);
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const light = daylight();
  const current = getDescent(descent);
  const anyUnlocked = DESCENTS.some((d, i) => i > 0 && d.unlocked(k));
  const { today, todayLabel, weather, weekWeather } = useMemo(() => {
    const { seed, label } = dailySeed();
    return { today: dayCard(seed), todayLabel: label, weather: dailyWeather(seed), weekWeather: weeklyWeather(weeklySeed().seed) };
  }, []);
  const streak = dailyStreakAlive(k, todayLabel);
  const inst = useInstall();
  const [iosHint, setIosHint] = useState(false);
  const [howTo, setHowTo] = useState(false);
  const offerInstall = k.runs >= 1 && canOfferInstall(inst);
  // A different fan every visit, seeded off the run count so it feels alive but not random-noise.
  // The fan is your deck once you have one: signature in the middle, your most-read cards around it.
  const fan = useMemo(() => {
    const read = Object.entries(k.cards)
      .filter(([, e]) => e.resolved > 0)
      .sort((a, b) => b[1].resolved - a[1].resolved)
      .map(([id]) => id)
      .filter((id) => id !== k.signature);
    if (k.runs > 0 && read.length + (k.signature ? 1 : 0) >= 5) {
      const around = read.slice(0, k.signature ? 4 : 5);
      const ordered = k.signature ? [around[0], around[2], k.signature, around[3], around[1]] : [around[3], around[1], around[0], around[2], around[4]];
      return ordered;
    }
    const pool = k.runs === 0 ? FAN_IDS : CARDS.filter((c) => c.arcana === 'major').map((c) => c.id);
    const start = (k.runs * 7) % pool.length;
    const step = pool.length === FAN_IDS.length ? 1 : 5;
    return Array.from({ length: 5 }, (_, i) => pool[(start + i * step) % pool.length]);
  }, [k.runs, k.cards, k.signature]);

  return (
    <main className={`screen screen--title screen--${light}`}>
      <TitleSky light={light} />
      <div className={`fan ${today === 'major-0' ? 'fan--fool' : ''}`} aria-hidden onClick={() => setFanDown((d) => !d)}>
        {fan.map((id, i) => (
          <div key={id} className={`fan__card ${fanDown ? 'fan__card--down' : ''}`} style={{ '--i': i } as React.CSSProperties}>
            <div className="flip-in" key={fanDown ? 'down' : 'up'}>
              <Card cardId={id} size="md" reversed={i === 1} faceDown={fanDown} />
            </div>
          </div>
        ))}
      </div>
      <div className="title">
        <div className="title__glyph">◯ △ ☐ ☾</div>
        <h1>Arcana Descent</h1>
        <p className="muted">Four seats. Three cards each. No one will tell you what they mean.</p>
        <button type="button" className={`chip chip--inline howto__chip ${k.runs === 0 ? 'chip--on' : ''}`} onClick={() => setHowTo(true)}>
          how it goes
        </button>
      </div>
      {howTo && <HowToPlay onClose={() => setHowTo(false)} />}
      {anyUnlocked && (
        <div className="descents">
          <div className="descents__row">
            {DESCENTS.map((d) => {
              const open = d.unlocked(k);
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`descent-chip ${d.id === descent ? 'descent-chip--on' : ''} ${open ? '' : 'descent-chip--locked'}`}
                  onClick={() => {
                    if (open) {
                      setDescent(d.id);
                      setLockedNote(null);
                    } else setLockedNote(d.unlockText);
                  }}
                  aria-label={d.name}
                >
                  {open ? (
                    <>
                      <CardBack variant={d.id === 'short' || d.id === 'standard' ? 'standard' : (d.id as BackVariant)} className="descent-chip__back" />
                      <span className="descent-chip__glyph">{d.glyph}</span>
                    </>
                  ) : (
                    '🔒'
                  )}
                </button>
              );
            })}
          </div>
          <p className="muted small">{lockedNote ? `Locked · ${lockedNote}` : `${current.name} · ${current.text}`}</p>
          {!lockedNote && current.id === 'standard' && maxDepth > 0 && (
            <div className="depth">
              <button className="btn btn--icon" onClick={() => setDepth(Math.max(0, depth - 1))} disabled={depth === 0} aria-label="shallower">
                −
              </button>
              <div className="depth__label">
                <div>{depth === 0 ? 'No depth' : `Depth ${depth} · ${DEPTHS[depth - 1].name}`}</div>
                <div className="muted small">{depth === 0 ? 'The usual dark.' : DEPTHS.slice(0, depth).map((d) => d.text).join(' ')}</div>
              </div>
              <button className="btn btn--icon" onClick={() => setDepth(Math.min(maxDepth, depth + 1))} disabled={depth >= maxDepth} aria-label="deeper">
                +
              </button>
            </div>
          )}
          {!lockedNote && k.records?.[current.id] && (
            <div className="record" aria-label="your record on this road">
              <span className="record__cell"><b>{k.records[current.id].runs}</b><span className="muted small">down</span></span>
              {current.config.endless ? (
                <span className="record__cell"><b>{(k.records[current.id].best?.road?.match(/◉/g) ?? []).length}</b><span className="muted small">abysses</span></span>
              ) : (
                <span className="record__cell"><b>{k.records[current.id].returns}</b><span className="muted small">back</span></span>
              )}
              <span className="record__cell"><b>{k.records[current.id].bestDepth}</b><span className="muted small">deepest</span></span>
              <span className="record__rate" title={current.config.endless ? 'the well has no way back' : 'returns over descents'}>
                <span className="record__rate-bar" style={{ width: `${current.config.endless ? 0 : Math.round((100 * k.records[current.id].returns) / Math.max(1, k.records[current.id].runs))}%` }} />
              </span>
            </div>
          )}
          {!lockedNote && k.records?.[current.id]?.best && (
            <div className="best" aria-label="best descent">
              <div className="last__cards">
                {k.records[current.id].best!.cards.map((c, i) => (
                  <Card key={`${c.cardId}-${i}`} cardId={c.cardId} reversed={c.reversed} size="xs" />
                ))}
              </div>
              <span className="muted small">
                Finest · {k.records[current.id].best!.returned ? 'returned' : `scene ${k.records[current.id].best!.depth}`} · {k.records[current.id].best!.good} good
              </span>
              {k.records[current.id].best!.road && (
                <span className="best__road" aria-label="the road taken">{k.records[current.id].best!.road}</span>
              )}
            </div>
          )}
        </div>
      )}
      {saved && (
        <div className="resume">
          <div className="muted small">
            A descent waits, {saved.run.history.length} scene{saved.run.history.length === 1 ? '' : 's'} down · ♥ {saved.run.vitality}
          </div>
          <div className="row">
            <button className="btn" onClick={abandon}>
              Let it go
            </button>
            <button className="btn btn--primary" onClick={resume}>
              Resume
            </button>
          </div>
        </div>
      )}
      <div className="stack">
        <button className="btn btn--primary" onClick={() => newRun()}>
          {current.id === 'standard' ? 'Descend' : `Descend · ${current.name}`}
        </button>
        <div className="row">
          <button className="btn" onClick={newDaily} title={`${weather.name}: ${weather.text}`}>
            Daily{streak > 1 ? ` · ${streak}` : ''} {streak > 1 && <StreakFlames n={streak} className="btn__flames" />}<span className="weather__glyph">{weather.glyph}</span>
          </button>
          <button className="btn" onClick={newWeekly} title={`A longer road, shared by everyone this week. ${weekWeather.name}: ${weekWeather.text}`}>
            Weekly <span className="weather__glyph">{weekWeather.glyph}</span>
          </button>
        </div>
        <WeatherArt id={weather.id} className="weather__art" />
        <p className="weather muted small center">
          Today · <span className="weather__name">{weather.glyph} {weather.name}</span> · {weather.text}
          <br />
          This week · <span className="weather__name">{weekWeather.glyph} {weekWeather.name}</span> · {weekWeather.text}
          <br />
          Tonight · <span className="weather__name">☾ {moonName(moonPhase())}</span> · {LIGHT_WORDS[light]}
        </p>
        <div className="row">
          <button className="btn btn--codex" onClick={() => goto('codex')}>
            Codex
            {known > 0 && (
              <svg className="ring" viewBox="0 0 24 24" aria-label={`${known} of ${CARDS.length} known`}>
                <circle cx={12} cy={12} r={9} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2.5} />
                <circle cx={12} cy={12} r={9} fill="none" stroke="#f3dc8a" strokeWidth={2.5} strokeDasharray={`${(known / CARDS.length) * 56.5} 56.5`} strokeLinecap="round" transform="rotate(-90 12 12)" />
              </svg>
            )}
          </button>
          <button className="btn" onClick={() => goto('settings')} aria-label="Settings">
            ⚙
          </button>
        </div>
      </div>
      {k.runs === 0 ? <p className="muted small">The deck is unread.</p> : <ReaderMark knowledge={k} />}
      {offerInstall && (
        <div className="keep rise" role="note">
          <p className="keep__lead">Keep the deck close. It works without a signal once it is on your home screen.</p>
          {iosHint ? (
            <p className="keep__hint">In Safari, tap <span className="keep__key">Share</span> below, then <span className="keep__key">Add to Home Screen</span>.</p>
          ) : (
            <div className="row keep__row">
              <button type="button" className="btn btn--small" onClick={() => (inst.deferred ? void inst.install() : setIosHint(true))}>
                Add to home screen
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={inst.dismiss}>
                Not now
              </button>
            </div>
          )}
        </div>
      )}
      {Object.keys(k.dealt ?? {}).length >= CARDS.length / 2 && Object.keys(k.dealt ?? {}).length < CARDS.length && (
        <p className="muted small">{CARDS.length - Object.keys(k.dealt ?? {}).length} cards have never been dealt to you.</p>
      )}
      {k.signature && (
        <p className="muted small center signature-line">
          <span className="card__sig card__sig--inline" aria-hidden>✦</span> Signature · {getCard(k.signature).name}
        </p>
      )}
      {k.last && (
        <div className={`last ${k.last.returned ? 'last--returned' : 'last--died'}`} aria-label="your last reading">
          <div className="muted small last__lead">
            <span className="last__mark" aria-hidden>{k.last.returned ? '☉' : '✖'}</span>
            {k.last.returned ? 'Last time, you came back.' : 'Last time, this ended you.'}
          </div>
          <div className="last__cards last__cards--laid">
            {k.last.cards.map((c, i) => (
              <div key={`${c.cardId}-${i}`} className="last__slot" style={{ '--i': i } as React.CSSProperties}>
                <Card cardId={c.cardId} reversed={c.reversed} size="xs" />
              </div>
            ))}
          </div>
          <div className="muted small last__outcome">{k.last.outcome}</div>
        </div>
      )}
      <button type="button" className={`today ${todayOpen ? 'today--open' : ''}`} aria-label="card of the day, tap to turn it" onClick={() => setTodayOpen((o) => !o)}>
        <span className="today__card">
          <Card cardId={today} size="xs" faceDown={!todayOpen} mark={todayOpen ? 'charged' : undefined} />
          {todayOpen && <span className="today__flare" aria-hidden />}
        </span>
        <span className="today__text">
          <span className="muted small">Today's card · {getCard(today).name} · <span className="today__charged">charged in the Daily</span></span>
          {streak >= STREAK_FOR_WEEK_CARD ? (
            <span className="muted small today__week">{streak} days running · the week's card, {getCard(dayCard(weeklySeed().seed)).name}, is charged too</span>
          ) : streak >= 3 ? (
            <span className="muted small today__week">{STREAK_FOR_WEEK_CARD - streak} more day{STREAK_FOR_WEEK_CARD - streak === 1 ? '' : 's'} and the week's card is charged too</span>
          ) : null}
          {todayOpen && <em className="today__omen rise">{getCard(today).omen.upright}</em>}
        </span>
      </button>
    </main>
  );
}
