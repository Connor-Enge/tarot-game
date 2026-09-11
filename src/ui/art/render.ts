import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getCard, SLOT_IDS, SLOTS, type DrawnCard } from '../../engine';
import { ArtDefs, CardArt } from './CardArt';
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
  /** The last outcome line. */
  outcome?: string;
}): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const cardW = 200;
  const cardH = 320;
  const gap = 36;
  const startX = (W - (cardW * 4 + gap * 3)) / 2;
  const cardY = 420;

  const defs = renderToStaticMarkup(createElement(ArtDefs)).replace(/<svg[^>]*>|<\/svg>/g, '');
  const cards = opts.cards
    .map((c, i) => {
      const x = startX + i * (cardW + gap);
      const inner = renderToStaticMarkup(createElement(CardArt, { cardId: c.cardId })).replace(/<svg[^>]*>|<\/svg>/g, '');
      const rot = c.reversed ? `rotate(180 ${x + cardW / 2} ${cardY + cardH / 2})` : '';
      const glyph = SLOTS[SLOT_IDS[i]].glyph;
      const label = opts.seatsNamed ? SLOTS[SLOT_IDS[i]].name.toUpperCase() : '';
      return `
        <text x="${x + cardW / 2}" y="${cardY - 40}" font-size="44" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">${glyph}</text>
        <g transform="${rot}">
          <g transform="translate(${x} ${cardY}) scale(${cardW / 100})">
            <rect x="0" y="0" width="100" height="160" rx="6" fill="#000" opacity="0.5" transform="translate(2 4)" />
            ${inner}
          </g>
        </g>
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
    <text x="${W / 2}" y="150" font-size="34" letter-spacing="10" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">◯ △ ☐ ☾</text>
    <text x="${W / 2}" y="235" font-size="60" text-anchor="middle" fill="#e9e4f2" font-family="Georgia, serif">${esc(opts.title)}</text>
    <text x="${W / 2}" y="290" font-size="28" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(opts.subtitle)}</text>
    ${cards}
    ${opts.outcome ? wrapText(esc(opts.outcome), W / 2, cardY + cardH + 170, 30, 46, '#e9e4f2') : ''}
    ${opts.journey ? `<text x="${W / 2}" y="${H - 215}" font-size="34" letter-spacing="12" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">${esc(opts.journey)}</text>` : ''}
    <text x="${W / 2}" y="${H - 150}" font-size="26" text-anchor="middle" fill="#8d86a3" font-family="Georgia, serif">${esc(opts.footer)}</text>
    <text x="${W / 2}" y="${H - 90}" font-size="30" letter-spacing="4" text-anchor="middle" fill="#d6b25e" font-family="Georgia, serif">ARCANA DESCENT</text>
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
export async function renderSkyImage(k: Knowledge, caption: string): Promise<Blob | null> {
  const S = 1080;
  const inner = renderToStaticMarkup(createElement(Constellation, { knowledge: k }));
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
