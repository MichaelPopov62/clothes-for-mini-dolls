/**
 * Проверка: у каждого товара непустой article и все артикулы уникальны.
 * Запуск: npm run check:articles
 */
import { products } from "../src/data/products";

const seen = new Map<string, number>();

for (const p of products) {
  const a = typeof p.article === "string" ? p.article.trim() : "";
  if (!a) {
    console.error(`Ошибка: пустой или отсутствующий article у товара id=${p.id}`);
    process.exit(1);
  }
  const prevId = seen.get(a);
  if (prevId !== undefined) {
    console.error(
      `Ошибка: дубликат article "${a}" — товары id=${prevId} и id=${p.id}`,
    );
    process.exit(1);
  }
  seen.set(a, p.id);
}

console.log(`Артикулы в порядке: ${products.length} позиций, дубликатов нет.`);
