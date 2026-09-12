// The phone fit pass: walks the built app at an iPhone 14/15 viewport (390x844), one
// screenshot and a clip measurement per screen and state. "clipped" is content a screen
// cuts off; "zone scroll" is what its scrolling middle region holds beyond the fold.
// Usage: npm run build && npx vite preview --port 4173 &  then  node scripts/fit.mjs [outDir]
// Needs playwright (npx playwright install chromium) or PLAYWRIGHT_PATH pointing at its index.mjs.
const pw = await import(process.env.PLAYWRIGHT_PATH ?? 'playwright');
const { chromium } = pw;
const W = 390, H = 844;
const out = process.argv[2] ?? '.';
const base = process.env.BASE_URL ?? 'http://localhost:4173/';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const rows = [];
let n = 0;
const measure = async (tag) => {
  await p.waitForTimeout(350);
  const m = await p.evaluate(() => {
    const se = document.scrollingElement;
    const screen = document.querySelector('.view:not(.view--out) .screen');
    const clipped = screen ? screen.scrollHeight - screen.clientHeight : 0;
    const zones = screen ? Array.from(screen.querySelectorAll('.scrollzone')).map((z) => z.scrollHeight - z.clientHeight) : [];
    const sheets = Array.from(document.querySelectorAll('.sheet__body')).map((el) => el.scrollHeight - el.clientHeight);
    // the bottom-most pinned control must be inside the viewport
    const btn = screen ? screen.querySelector('.actions, .stack') : null;
    const r = btn ? btn.getBoundingClientRect() : null;
    return { page: se.scrollHeight, clipped, zones, sheets, btnBottom: r ? Math.round(r.bottom) : null };
  });
  const zone = m.zones.length ? Math.max(...m.zones) : 0;
  const sheet = m.sheets.length ? Math.max(...m.sheets) : 0;
  rows.push({ tag, page: m.page, clipped: m.clipped, zone, sheet, btnBottom: m.btnBottom });
  await p.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-${tag}.png`, fullPage: false });
  console.log(`${tag.padEnd(20)} page ${m.page - H > 0 ? '+' + (m.page - H) : 'ok'} · clipped ${m.clipped} · zone scroll ${zone}${m.sheets.length ? ` · sheet scroll ${sheet}` : ''}${m.btnBottom !== null ? ` · controls end ${m.btnBottom}` : ''}`);
};
const closeSheet = async () => { const c = p.locator('.sheet button', { hasText: /^close$/i }).first(); if (await c.count()) await c.click(); else await p.keyboard.press('Escape'); await p.waitForTimeout(250); };
const click = async (sel) => { const l = typeof sel === 'string' ? p.locator(sel).first() : sel; if (await l.count()) { await l.click(); return true; } return false; };
await p.goto(base); await p.waitForTimeout(800);
await measure('title-first');
await p.getByRole('button', { name: /how it goes/i }).first().click(); await measure('howto'); await closeSheet();
await p.getByRole('button', { name: /^codex/i }).click(); await p.waitForTimeout(800); await measure('codex');
const tabs = await p.locator('.tabs button, [role=tablist] button, .codex__tabs button').allInnerTexts().catch(() => []);
console.log('codex tabs:', tabs.map((t) => t.trim()).filter(Boolean).join(' | '));
await click('.codex .card, .codex__grid .card, .grid .card'); await measure('codex-detail'); await closeSheet();
for (const t of ['sky', 'book', 'study', 'table', 'ledger', 'rites']) { const l = p.getByRole('button', { name: new RegExp(`^${t}`, 'i') }).first(); if (await l.count()) { await l.click(); await p.waitForTimeout(500); await measure(`codex-${t}`); } }
await p.goto(base); await p.waitForTimeout(500);
await click(p.getByRole('button', { name: /^⚙|settings/i })); await measure('settings');
await p.goto(base); await p.waitForTimeout(500);
await p.getByRole('button', { name: /descend/i }).first().click(); await p.waitForTimeout(700); await measure('map-start');
await p.locator('.node--choosable').first().click(); await p.waitForTimeout(900); await measure('reading-start');
await p.keyboard.press('1'); await measure('reading-lifted');
await p.getByRole('button', { name: /lamp/i }).click().catch(() => {}); await measure('reading-lamp');
await p.keyboard.press('Enter'); await p.waitForTimeout(800); await measure('reading-placed1');
await p.keyboard.press('1'); await p.waitForTimeout(200); await p.getByRole('button', { name: /consult/i }).click(); await measure('reading-codexsheet'); await closeSheet();
await click('.deck-pill'); await measure('reading-decksheet'); await closeSheet();
for (let tries = 0; tries < 8 && !(await p.locator('.screen--resolution').count()); tries++) { await p.keyboard.press('1'); await p.waitForTimeout(250); await p.keyboard.press('Enter'); await p.waitForTimeout(700); }
await p.waitForTimeout(6500); await measure('resolution');
await p.getByRole('button', { name: /walk on|look closer|crawl on/i }).click(); await p.waitForTimeout(800);
if (await p.locator('button.relic').count()) { await measure('relic'); await p.locator('button.relic').first().click(); await p.waitForTimeout(800); }
await measure('map-2');
await click('.node--visited'); await measure('memory-sheet'); await closeSheet();
// play on to the end quickly
for (let scene = 1; scene < 12; scene++) {
  if (!(await p.locator('.node--choosable').count())) break;
  await p.locator('.node--choosable').first().click(); await p.waitForTimeout(800);
  if (scene === 8) await measure('reading-abyss');
  for (let s = 0; s < 4; s++) { await p.keyboard.press('1'); await p.waitForTimeout(150); await p.keyboard.press('Enter'); await p.waitForTimeout(500); }
  await p.waitForTimeout(3200);
  const walk = p.getByRole('button', { name: /walk on|look closer|crawl on|go under/i });
  if (!(await walk.count())) break;
  await walk.click(); await p.waitForTimeout(700);
  if (await p.locator('button.relic').count()) { await p.locator('button.relic').first().click(); await p.waitForTimeout(700); }
}
await measure('run-end');
await click(p.getByRole('button', { name: /the descent/i })); await measure('run-end-journal');
await click(p.getByRole('button', { name: /again/i })); await p.waitForTimeout(800); await measure('title-return');
await b.close();
console.log('\nCLIPPED:', rows.filter((r) => r.clipped > 0 || r.page > H || (r.btnBottom !== null && r.btnBottom > H)).map((r) => `${r.tag} clip ${r.clipped} page ${r.page} btn ${r.btnBottom}`).join(', ') || 'none');
console.log('ZONES SCROLLING:', rows.filter((r) => r.zone > 0).map((r) => `${r.tag} ${r.zone}`).join(', ') || 'none');
