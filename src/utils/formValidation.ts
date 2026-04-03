/** Валидация полей форм заказа (кириллица, телефон, количество, e-mail) */

const CYRILLIC_NAME =
  /^[А-Яа-яЁёІіЇїЄєҐґ]+(?: [А-Яа-яЁёІіЇїЄєҐґ]+)*$/;

/** Имя: не пусто после trim, только кириллические буквы и пробелы между словами, минимум 2 буквы */
export function validateClientName(value: string): "введите имя" | "имя некорректно" | null {
  const t = value.trim().replace(/\s+/g, " ");
  if (t.length === 0) return "введите имя";
  if (!CYRILLIC_NAME.test(t)) return "имя некорректно";
  const letterCount = t.replace(/\s/g, "").length;
  if (letterCount < 2) return "имя некорректно";
  return null;
}

/** Телефон: только цифры, длина 10–15 */
export function validatePhone(digits: string): "Введите телефон" | "Только цифры" | "От 10 до 15 цифр" | null {
  const t = digits.trim();
  if (t.length === 0) return "Введите телефон";
  if (!/^\d+$/.test(t)) return "Только цифры";
  if (t.length < 10 || t.length > 15) return "От 10 до 15 цифр";
  return null;
}

/** Количество: целое число > 0, без дробей */
export function validateOrderQuantity(
  value: string,
): "введите количество" | "Только цифри" | "Минимум 1" | null {
  const t = value.trim();
  if (t.length === 0) return "введите количество";
  if (!/^\d+$/.test(t)) return "Только цифри";
  const n = parseInt(t, 10);
  if (!Number.isFinite(n) || n < 1) return "Минимум 1";
  return null;
}

const EMAIL_SIMPLE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Базовая проверка e-mail */
export function validateEmail(value: string): "Введите e-mail" | "E-mail некорректен" | null {
  const t = value.trim();
  if (t.length === 0) return "Введите e-mail";
  if (!EMAIL_SIMPLE.test(t)) return "E-mail некорректен";
  return null;
}
