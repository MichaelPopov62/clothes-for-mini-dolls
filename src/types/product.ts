export type Product = {
  id: number;
  title: string;
  /** Отображаемая цена в каталоге и модалке */
  price: string;
  /** Цена за единицу в гривнах (совпадает с числом в `price`, для расчёта суммы) */
  priceAmount: number;
  description: string;
  image: string;
  category: "women" | "men" | "couples";
  videos?: string[];
};
