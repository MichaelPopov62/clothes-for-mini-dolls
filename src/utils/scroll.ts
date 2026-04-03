/** Плавный скролл к элементу по `id` */
export function smoothScrollToId(id: string): void {
  globalThis.document?.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
}
