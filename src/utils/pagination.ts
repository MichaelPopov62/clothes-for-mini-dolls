/** Номера страниц и многоточие для компактной пагинации */
export type PageToken = number | "ellipsis";

/**
 * При total === 1 возвращает [1] (без дубля последней страницы).
 * При total < 1 — пустой массив (нет страниц).
 */
export function getPageTokens(
  current: number,
  total: number,
  siblingCount = 2,
): PageToken[] {
  const totalInt = Number.isFinite(total) ? Math.floor(total) : 0;
  const safeTotal = Math.max(0, totalInt);
  if (safeTotal < 1) return [];
  if (safeTotal === 1) return [1];

  const curInt = Number.isFinite(current) ? Math.floor(current) : 1;
  const safeCurrent = Math.max(1, Math.min(safeTotal, curInt));
  const sibInt = Number.isFinite(siblingCount) ? Math.floor(siblingCount) : 0;
  const sibs = Math.max(0, sibInt);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, i) => i + 1);
  }

  const first = 1;
  const last = safeTotal;

  const start = Math.max(first + 1, safeCurrent - sibs);
  const end = Math.min(last - 1, safeCurrent + sibs);

  const tokens: PageToken[] = [first];

  if (start > first + 1) tokens.push("ellipsis");
  for (let p = start; p <= end; p++) tokens.push(p);
  if (end < last - 1) tokens.push("ellipsis");

  tokens.push(last);
  return tokens;
}
