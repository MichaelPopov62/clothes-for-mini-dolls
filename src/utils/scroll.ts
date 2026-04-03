/** Плавный скролл к элементу по `id` (клиентское приложение) */
export function smoothScrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
