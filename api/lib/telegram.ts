/** Отправка текста в Telegram (Bot API). Переменные TELEGRAM_TOKEN и TELEGRAM_CHAT_ID задаются в Vercel / .env для vercel dev */

type TelegramApiResult = {
  ok: boolean;
  description?: string;
};

export async function sendToTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Не заданы TELEGRAM_TOKEN или TELEGRAM_CHAT_ID");
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const data = (await response.json()) as TelegramApiResult;
  if (!data.ok) {
    throw new Error(data.description ?? "Ошибка Telegram API");
  }
}
