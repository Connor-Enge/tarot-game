// A full descent played through the built app, seat by seat, collecting page and console errors.
// Usage: npm run build && npx vite preview --port 4173 &  then  node scripts/playthrough.mjs [outDir]
// Needs playwright (npx playwright install chromium) or PLAYWRIGHT_PATH pointing at its index.mjs.
const pw = await import(process.env.PLAYWRIGHT_PATH ?? 'playwright');
const { chromium } = pw;
const out = process.argv[2] ?? '.';
const base = process.env.BASE_URL ?? 'http://localhost:4173/';
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const errors = []; page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
await page.goto(base);
await page.evaluate(() => {
  const cards = {}; for (const id of ['major-0','major-19','cups-2','wands-5','pentacles-9','swords-6','major-1','major-16']) cards[id] = { tier: 3, resolved: 5, seats: { vessel: 2 }, witnessed: { upright: true } };
  const links = { 'major-0|major-19': 3, 'cups-2|wands-5': 4 };
  localStorage.setItem('arcana-descent.knowledge.v1', JSON.stringify({ version: 1, seatsNamed: true, runs: 4, deaths: 2, ascensions: 1, cards, omenLog: [], links, combos: ['four-upright'] }));
  localStorage.removeItem('arcana-descent.run.v1');
});
await page.reload(); await page.waitForTimeout(600);
await page.getByRole('button', { name: /^Descend/ }).first().click(); await page.waitForTimeout(1200);
const seen = new Set(); let steps = 0; let scenes = 0; let ended = false;
while (steps++ < 260 && !ended) {
  if (await page.locator('.screen--end').count()) { ended = true; break; }
  const leave = page.getByRole('button', { name: /^Leave it$/ });
  if (await leave.count() && await leave.isEnabled()) { await leave.click(); await page.waitForTimeout(400); seen.add('cut'); continue; }
  if (await page.locator('.relic').count()) { await page.locator('.relic').first().click(); await page.waitForTimeout(700); seen.add('relic'); continue; }
  const adv = page.getByRole('button', { name: /^(Look closer|Go under|Crawl on|Walk on)$/ });
  if (await adv.count()) { await page.mouse.click(5, 5); await page.waitForTimeout(300); await adv.first().click({ timeout: 15000 }).catch(() => {}); await page.waitForTimeout(900); seen.add('resolution'); continue; }
  if (await page.locator('.hand .card').count()) {
    if (await page.locator('.lamp-mark').count() === 0 && Math.random() < 0.3) { await page.keyboard.press('l'); await page.waitForTimeout(250); }
    await page.keyboard.press(String(1 + Math.floor(Math.random() * 3))); await page.waitForTimeout(150);
    if (Math.random() < 0.15) { await page.keyboard.press('w'); await page.waitForTimeout(200); }
    await page.keyboard.press('Enter'); await page.waitForTimeout(700); seen.add('reading'); continue;
  }
  const node = page.locator('.node--choosable');
  if (await node.count()) { await node.first().click(); await page.waitForTimeout(1200); scenes++; seen.add('map'); continue; }
  const dismiss = page.locator('.act-banner');
  if (await dismiss.count()) { await dismiss.click(); await page.waitForTimeout(300); continue; }
  await page.waitForTimeout(500);
}
console.log('ended', ended, 'steps', steps, 'scenes entered', scenes, 'screens', [...seen].join(','), 'errors', errors.length ? errors : 'none');
await page.screenshot({ path: `${out}/playthrough-end.png`, fullPage: false });
if (ended) {
  await page.getByRole('button', { name: /The descent/ }).click().catch(() => {});
  await page.waitForTimeout(500);
  console.log('chronicle lines', await page.locator('.chronicle__line').count(), 'road', await page.locator('.road').count());
}
await b.close();
