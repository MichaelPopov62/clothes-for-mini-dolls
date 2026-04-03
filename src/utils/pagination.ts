/** Номера страниц и многоточие для компактной пагинации */
export type PageToken = number | "ellipsis";

export function getPageTokens(
  current: number,
  total: number,
  siblingCount = 2,
): PageToken[] {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const first = 1;
  const last = total;

  const start = Math.max(first + 1, current - siblingCount);
  const end = Math.min(last - 1, current + siblingCount);

  const tokens: PageToken[] = [first];

  if (start > first + 1) tokens.push("ellipsis");
  for (let p = start; p <= end; p++) tokens.push(p);
  if (end < last - 1) tokens.push("ellipsis");

  tokens.push(last);
  return tokens;
}
