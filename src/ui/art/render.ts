import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getCard, SLOT_IDS, SLOTS, type DrawnCard } from '../../engine';
import { ArtDefs, CardArt } from './CardArt';
import { RelicArt } from './relics';
import { SigilToken } from './sigil';
import { Constellation } from '../components/Constellation';
import type { Knowledge } from '../../engine';

/**
 * Rasterize a spread to a PNG blob for sharing. Builds a standalone SVG
 * (defs inlined, cards positioned), draws it to a canvas, exports.
 */
export async function renderSpreadImage(opts: {
  cards: DrawnCard[];
  title: string;
  subtitle: string;
  footer: string;
  seatsNamed: boolean;
  /** One glyph per scene, in order. */
  journey?: string;
  /** Kind glyph per scene visited, in order. */
  road?: string;
  /** The last outcome line. */
  outcome?: string;
  /** A small line under the footer: weather, vow. */
  notes?: string;
  /** One stop per scene: the map glyph and how the reading went. Drawn as a road when present. */
  stops?: { glyph: string; tier: 'calamity' | 'harm' | 'neutral' | 'boon' | 'triumph' }[];
  /** The player's signature card, sealed with a star if it is on the table. */
  signature?: string;
  /** Relics carried at the end, drawn as tokens with their names. */
  carried?: { id: string; name: string }[];
  /** Sigils earned by this descent, drawn as medallions with their names. */
  sigils?: { id: string; glyph: string; name: string }[];
}): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const cardW = 200;
  const cardH = 320;
  const gap = 36;
  const startX = (W - (cardW * 4 + gap * 3)) / 2;
  const cardY = 400;
  const tokens = tokensSvg(opts.carried ?? [], opts.sigils ?? [], W, H - 322);
  // With a token row the bottom block packs tighter.
  const roadY = tokens ? H - 212 : H - 250;
  const notesY = tokens ? H - 136 : H - 188;
  const footerY = tokens ? H - 106 : H - 150;
  const brandY = tokens ? H - 66 : H - 90;

  const defs = renderToStaticMarkup(createElement(ArtDefs)).replace(/<svg[^>]*>|<\/svg>/g, '');
  const cards = opts.cards
    .map((c, i) => {
      const x = startX + i * (cardW + gap);
      const inner = renderToStaticMarkup(createElement(CardArt, { cardId: c.cardId })).replace(/<svg[^>]*>|<\/svg>/g, '');
      const rot = c.reversed ? `rotate(180 ${x + cardW / 2} ${cardY + cardH / 2})` : '';
      const glyph = SLOTS[SLOT_IDS[i]].glyph;
      const label = opts.seatsNamed ? SLOTS[SLOT_IDS[i]].name.toUpperCase() : '';
      const seal = opts.signature === c.cardId
        ? `<g transform="translate(${x + cardW - 6} ${cardY - 6})">
            <circle r="22" fill="#0b0a12" stroke="#f3dc8a" stroke-width="2" />
            <circle r="17" fill="none" stroke="#d6b25e" stroke-width="0.8" stroke-dasharray="2 3" />
            <text y="2" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#f3dc8a" font-family="Georgia, serif">✦</text>
          </g>`
        : '';
      return `
        <text x="${x + cardW / 2}" y="${cardY - 40}" font-size="44" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">${glyph}</text>
        <g transform="${rot}">
          <g transform="translate(${x} ${cardY}) scale(${cardW / 100})">
            <rect x="0" y="0" width="100" height="160" rx="6" fill="#000" opacity="0.5" transform="translate(2 4)" />
            ${inner}
          </g>
        </g>
        ${seal}
        <text x="${x + cardW / 2}" y="${cardY + cardH + 44}" font-size="18" letter-spacing="3" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${label}</text>
        <text x="${x + cardW / 2}" y="${cardY + cardH + 78}" font-size="22" text-anchor="middle" fill="#e9e4f2" font-family="Georgia, serif">${esc(getCard(c.cardId).name)}${c.reversed ? ' ↓' : ''}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs}
    <defs>
      <radialGradient id="shareBg" cx="0.5" cy="0.1" r="0.9">
        <stop offset="0" stop-color="#2a2450" />
        <stop offset="1" stop-color="#0b0a12" />
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#shareBg)" />
    <rect x="30" y="30" width="${W - 60}" height="${H - 60}" rx="18" fill="none" stroke="#c9a24a" stroke-width="2" opacity="0.6" />
    <rect x="42" y="42" width="${W - 84}" height="${H - 84}" rx="14" fill="none" stroke="#c9a24a" stroke-width="0.8" opacity="0.4" />
    <text x="${W / 2}" y="130" font-size="34" letter-spacing="10" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">◯ △ ☐ ☾</text>
    <text x="${W / 2}" y="215" font-size="60" text-anchor="middle" fill="#e9e4f2" font-family="Georgia, serif">${esc(opts.title)}</text>
    <text x="${W / 2}" y="270" font-size="28" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(opts.subtitle)}</text>
    ${cards}
    ${opts.outcome ? wrapText(esc(opts.outcome), W / 2, cardY + cardH + 170, 30, 46, '#e9e4f2') : ''}
    ${tokens}
    ${opts.stops && opts.stops.length ? roadSvg(opts.stops, W, roadY, opts.title.includes('ended')) : ''}
    ${!opts.stops && opts.road ? `<text x="${W / 2}" y="${H - 262}" font-size="30" letter-spacing="14" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(opts.road)}</text>` : ''}
    ${!opts.stops && opts.journey ? `<text x="${W / 2}" y="${H - 215}" font-size="34" letter-spacing="12" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">${esc(opts.journey)}</text>` : ''}
    <text x="${W / 2}" y="${footerY}" font-size="26" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(opts.footer)}</text>
    ${opts.notes ? `<text x="${W / 2}" y="${notesY}" font-size="24" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">${esc(opts.notes)}</text>` : ''}
    <text x="${W / 2}" y="${brandY}" font-size="30" letter-spacing="4" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">ARCANA DESCENT</text>
  </svg>`;

  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('svg failed'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Relics carried and sigils earned as a row of small tokens with names. */
function tokensSvg(carried: { id: string; name: string }[], sigils: { id: string; glyph: string; name: string }[], W: number, y: number): string {
  const items = [
    ...carried.map((r) => ({ name: r.name, art: renderToStaticMarkup(createElement(RelicArt, { id: r.id })) })),
    ...sigils.map((sg) => ({ name: sg.name, art: renderToStaticMarkup(createElement(SigilToken, { id: sg.id, glyph: sg.glyph, earned: true })) })),
  ].slice(0, 6);
  if (items.length === 0) return '';
  const slot = Math.min(170, (W - 120) / items.length);
  const x0 = (W - slot * items.length) / 2;
  return items
    .map((it, i) => {
      const inner = it.art.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] ?? '';
      const cx = x0 + slot * (i + 0.5);
      return `<g transform="translate(${cx - 24} ${y - 24}) scale(1.2)">${inner}</g>
        <text x="${cx}" y="${y + 44}" font-size="17" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(it.name)}</text>`;
    })
    .join('');
}

function wrapText(text: string, x: number, y: number, size: number, maxChars: number, fill: string): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
    } else cur = `${cur} ${w}`;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines
    .slice(0, 4)
    .map((l, i) => `<text x="${x}" y="${y + i * (size * 1.35)}" font-size="${size}" text-anchor="middle" fill="${fill}" font-family="Georgia, serif" font-style="italic">${l}</text>`)
    .join('');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Rasterize the Codex sky to a square PNG. */
export async function renderSkyImage(k: Knowledge, caption: string, live: string[] = []): Promise<Blob | null> {
  const S = 1080;
  const inner = renderToStaticMarkup(createElement(Constellation, { knowledge: k, live }));
  const svgInner = inner.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] ?? '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <defs><radialGradient id="skyBg" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#2a2450" /><stop offset="1" stop-color="#0b0a12" /></radialGradient></defs>
    <rect width="${S}" height="${S}" fill="url(#skyBg)" />
    <g transform="translate(90 120) scale(3)">${svgInner}</g>
    <text x="${S / 2}" y="${S - 70}" font-size="30" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(caption)}</text>
    <text x="${S / 2}" y="70" font-size="30" letter-spacing="6" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">ARCANA DESCENT · THE SKY</text>
  </svg>`;
  return svgToPng(svg, S, S);
}

async function svgToPng(svg: string, w: number, h: number): Promise<Blob | null> {
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('svg failed'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const TIER_COLOR = { calamity: '#d6605e', harm: '#e0a39a', neutral: '#8d86a3', boon: '#d6b25e', triumph: '#f3dc8a' } as const;

/** The road as drawn on the journal, sized for the share image. */
function roadSvg(stops: { glyph: string; tier: keyof typeof TIER_COLOR }[], W: number, cy: number, ended: boolean): string {
  const n = stops.length;
  const span = Math.min(760, 90 + n * 70);
  const x0 = (W - span) / 2;
  const pts = stops.map((st, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    return { x: x0 + t * span, y: cy + Math.sin(i * 1.9) * 16 + t * 10, st };
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `Q${(pts[i - 1].x + p.x) / 2} ${pts[i - 1].y + 10} ${p.x} ${p.y}`)).join(' ');
  const circles = pts
    .map((p, i) => {
      const last = i === n - 1;
      const r = last ? 22 : 16;
      const c = TIER_COLOR[p.st.tier];
      return `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="#0b0a12" stroke="${c}" stroke-width="${last ? 3 : 2}" />
        ${p.st.tier === 'triumph' ? `<circle cx="${p.x}" cy="${p.y}" r="${r + 10}" fill="${c}" opacity="0.15" />` : ''}
        <text x="${p.x}" y="${p.y + 1}" font-size="${last ? 20 : 16}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-family="Georgia, serif">${p.st.glyph}</text>
        ${last && ended ? `<text x="${p.x}" y="${p.y - 34}" font-size="20" text-anchor="middle" fill="#d6605e" font-family="Georgia, serif">✖</text>` : ''}`;
    })
    .join('');
  return `<path d="${d}" fill="none" stroke="#d6b25e" stroke-width="3" opacity="0.5" />
    <path d="${d}" fill="none" stroke="#1a1408" stroke-width="2" stroke-dasharray="3 9" opacity="0.7" />
    ${circles}`;
}
