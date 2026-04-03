import { Buffer } from "node:buffer";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendToTelegram } from "../lib/telegram.js";

/** Тело запроса от клиента (заказ из модалки каталога) */
type OrderPayload = {
  productId?: unknown;
  productTitle?: unknown;
  priceLabel?: unknown;
  quantity?: unknown;
  lineTotalFormatted?: unknown;
  clientName?: unknown;
  phone?: unknown;
  email?: unknown;
};

/** Объект, JSON-строка или Buffer (на проде Vercel встречается и то и другое) */
function parseOrderBody(raw: unknown): OrderPayload | null {
  if (raw == null) return null;
  if (Buffer.isBuffer(raw)) {
    try {
      const parsed: unknown = JSON.parse(raw.toString("utf8"));
      return typeof parsed === "object" && parsed !== null ? (parsed as OrderPayload) : null;
    } catch {
      return null;
    }
  }
  if (typeof raw === "string") {
    try {
      const parsed: unknown = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? (parsed as OrderPayload) : null;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") return raw as OrderPayload;
  return null;
}

/** Если body не распарсили заранее — читаем поток (иначе parseOrderBody получает undefined) */
function readBodyFromStream(req: VercelRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: string | Buffer) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk);
    });
    req.on("end", () => {
      try {
        const s = Buffer.concat(chunks).toString("utf8");
        resolve(s.trim() ? JSON.parse(s) : null);
      } catch {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

async function resolveRequestBody(req: VercelRequest): Promise<unknown> {
  if (req.body === undefined || req.body === null) {
    return readBodyFromStream(req);
  }
  return req.body;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v > 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Метод не поддерживается" });
  }

  const body = parseOrderBody(await resolveRequestBody(req));
  if (!body) {
    return res.status(400).json({ success: false, message: "Некорректное тело запроса" });
  }

  const {
    productId,
    productTitle,
    priceLabel,
    quantity,
    lineTotalFormatted,
    clientName,
    phone,
    email,
  } = body;

  if (!isNonEmptyString(productTitle)) {
    return res.status(400).json({ success: false, message: "Не указан товар" });
  }
  if (!isPositiveInt(quantity)) {
    return res.status(400).json({ success: false, message: "Некорректное количество" });
  }
  if (!isNonEmptyString(clientName)) {
    return res.status(400).json({ success: false, message: "Не указано имя" });
  }
  if (!isNonEmptyString(phone)) {
    return res.status(400).json({ success: false, message: "Не указан телефон" });
  }
  if (!isNonEmptyString(email)) {
    return res.status(400).json({ success: false, message: "Не указан e-mail" });
  }

  const idLine =
    typeof productId === "number" && Number.isFinite(productId)
      ? `ID: ${productId}`
      : "ID: —";
  const priceStr = isNonEmptyString(priceLabel) ? priceLabel : "—";
  const totalStr = isNonEmptyString(lineTotalFormatted) ? lineTotalFormatted : "—";

  const messageText =
    `🛒 Новый заказ\n` +
    `— — —\n` +
    `Товар: ${productTitle.trim()}\n` +
    `${idLine}\n` +
    `Цена (каталог): ${priceStr}\n` +
    `Количество: ${quantity}\n` +
    `Сумма: ${totalStr}\n` +
    `— — —\n` +
    `Имя: ${clientName.trim()}\n` +
    `Телефон: ${phone.trim()}\n` +
    `E-mail: ${email.trim()}`;

  try {
    await sendToTelegram(messageText);
    return res.status(200).json({ success: true, message: "Заказ отправлен" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Не удалось отправить заказ. Попробуйте позже.",
    });
  }
}
