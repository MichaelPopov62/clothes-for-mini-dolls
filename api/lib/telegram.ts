/** Отправка текста в Telegram (Bot API). Переменные TELEGRAM_TOKEN и TELEGRAM_CHAT_ID задаются в Vercel / .env для vercel dev */

type TelegramApiResult = {
  ok: boolean;
  description?: string;
};

/** Есть ли непустые переменные (после trim) — без вызова сети */
export function isTelegramEnvConfigured(): boolean {
  const token = process.env.TELEGRAM_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  return Boolean(token && chatId);
}

/**
 * chat_id в Bot API: число или строка; из Vercel часто приходит строка с цифрами.
 * Лишние пробелы и обёртки в кавычки ломают отправку — нормализуем.
 */
function normalizeChatId(raw: string): string | number {
  const t = raw.trim().replace(/^["']|["']$/g, "");
  if (/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
  }
  return t;
}

export async function sendToTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_TOKEN?.trim();
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatIdRaw) {
    throw new Error("Не заданы TELEGRAM_TOKEN или TELEGRAM_CHAT_ID");
  }

  const chat_id = normalizeChatId(chatIdRaw);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text,
      disable_web_page_preview: true,
    }),
  });

  let data: TelegramApiResult;
  try {
    data = (await response.json()) as TelegramApiResult;
  } catch {
    throw new Error(
      `Ответ Telegram не JSON (HTTP ${response.status}). Проверьте TELEGRAM_TOKEN.`,
    );
  }
  if (!data.ok) {
    throw new Error(data.description ?? "Ошибка Telegram API");
  }
}
