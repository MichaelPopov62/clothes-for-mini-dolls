/** Подпись артикула для витрины и форм (понятно без контекста) */
export function formatArticleDisplay(article: string): string {
  const t = article.trim();
  return t.length === 0 ? "" : `арт. ${t}`;
}
