/**
 * Накладывает только текст «MiniModa Studio» (SVG) внизу по центру, без плашки.
 * Светлая заливка + тёмная обводка — читается на белой одежде (014–016) и на тёмной.
 * Строка чуть выше нижнего края кадра (padBottom + liftFromBottom).
 *
 * Кегль фиксированный в пикселях исходника (WM_FONT_PX), чтобы на всех кадрах
 * одинаковый размер подписи; на очень мелких изображениях уменьшается, чтобы не вылезать за кадр.
 *
 * Важно: не запускайте повторно на тех же файлах — слой наложится второй раз.
 * Держите резервную копию оригиналов.
 *
 * Каталог `public/images/products/master/` не обрабатывается (портрет мастера).
 *
 * Запуск: npm run watermark:products
 */
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_DIR = path.join(ROOT, "public", "images", "products");

/** Подкаталоги каталога products без штамповки (портрет мастера и т.д.) */
const SKIP_WATERMARK_SUBDIRS = new Set(["master"]);

const WM_TEXT = "MiniModa Studio";
/** Фиксированный размер шрифта в координатах файла (px); единый для всех нормальных фото */
const WM_FONT_PX = 22;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvgWatermark(width: number, height: number): Buffer {
  const W = width;
  const H = height;
  const s = Math.min(W, H);
  /** Отступ от низа + заметный подъём строки вверх от края */
  const padBottom = Math.max(18, Math.round(s * 0.032));
  const liftFromBottom = Math.max(60, Math.round(s * 0.09));
  /**
   * На типичных фото (короткая сторона ≥ 220px) — везде один и тот же кегль WM_FONT_PX.
   * Ниже порога уменьшаем, чтобы подпись не вылезала за край.
   */
  const fontSize =
    s >= 220
      ? WM_FONT_PX
      : Math.max(12, Math.min(WM_FONT_PX, Math.floor(s * 0.13)));
  const centerX = W / 2;
  const baselineY = H - padBottom - liftFromBottom;
  const strokeW = Math.max(0.65, fontSize * 0.08);

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .wm {
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        font-weight: 600;
        font-size: ${fontSize}px;
        fill: rgba(253, 253, 255, 0.94);
        stroke: rgba(15, 23, 42, 0.58);
        stroke-width: ${strokeW}px;
        paint-order: stroke fill;
      }
    </style>
  </defs>
  <text x="${centerX}" y="${baselineY}" text-anchor="middle" dominant-baseline="alphabetic" class="wm">${escapeXml(WM_TEXT)}</text>
</svg>`;

  return Buffer.from(svg, "utf8");
}

async function walkWebp(dir: string): Promise<string[]> {
  const results: string[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_WATERMARK_SUBDIRS.has(ent.name.toLowerCase())) {
        continue;
      }
      results.push(...(await walkWebp(full)));
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith(".webp")) {
      results.push(full);
    }
  }
  return results;
}

async function watermarkFile(filePath: string): Promise<void> {
  // Читаем целиком в память — не держим исходный путь открытым во время записи
  const raw = await fs.readFile(filePath);
  const meta = await sharp(raw).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) {
    console.warn(`Пропуск (нет размеров): ${path.relative(ROOT, filePath)}`);
    return;
  }

  const svgBuffer = buildSvgWatermark(W, H);

  const buf = await sharp(raw)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .webp({ quality: 88 })
    .toBuffer();

  /**
   * На Windows прямой writeFile в файл под OneDrive/антивирусом часто даёт
   * UNKNOWN (errno -4094). Запись во временный файл в %TEMP% + copyFile
   * перезаписывает цель другим системным вызовом и обычно проходит.
   */
  const tmp = path.join(
    os.tmpdir(),
    `wm-${randomBytes(12).toString("hex")}.webp`,
  );
  try {
    await fs.writeFile(tmp, buf);
    await fs.copyFile(tmp, filePath);
  } finally {
    await fs.unlink(tmp).catch(() => {});
  }
}

async function main(): Promise<void> {
  console.warn(
    "Водянка: «MiniModa Studio», низ по центру (чуть выше края), светлый текст + тёмная обводка. Папка master/ пропускается. Повторный запуск добавит второй слой.",
  );

  try {
    await fs.access(PRODUCTS_DIR);
  } catch {
    console.error(`Папка не найдена: ${path.relative(ROOT, PRODUCTS_DIR)}`);
    process.exit(1);
  }

  const files = await walkWebp(PRODUCTS_DIR);
  if (files.length === 0) {
    console.log("Нет .webp в public/images/products.");
    return;
  }

  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      await watermarkFile(file);
      ok += 1;
      console.log(`OK ${rel}`);
    } catch (e) {
      fail += 1;
      console.error(`Ошибка ${rel}:`, e);
      console.error(
        "  (закройте предпросмотр/редактор, синхронизацию облака для этого файла и повторите для пропущенных.)",
      );
    }
  }

  console.log(`Готово: успешно ${ok}, с ошибкой ${fail} из ${files.length}.`);
  if (fail > 0) {
    process.exit(1);
  }
}

await main();
