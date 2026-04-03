/** Формат суммы в гривнах, как в каталоге */
export function formatPriceUah(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "0 грн.";
  }
  return `${amount} грн.`;
}
