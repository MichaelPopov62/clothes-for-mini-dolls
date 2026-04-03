import { useState } from "react";
import type { ProductModalProps } from "../types";
import { formatPriceUah } from "@/utils";
import { validateOrderQuantity } from "../utils/formValidation";
import ProductCheckoutForm from "./ProductCheckoutForm";
import ProductOrderForm from "./ProductOrderForm";
import styles from "./ProductModal.module.css";

type ModalStep = "details" | "order" | "checkout";

/**
 * URL API заказа. По умолчанию тот же origin (`/api/send-order` на Vercel).
 * VITE_ORDER_API_URL вшивается в бандл при сборке: если там localhost, в production
 * браузер пользователя ходит на его же localhost — заказ никогда не уйдёт; в prod такое игнорируем.
 */
function resolveOrderApiUrl(): string {
  const raw = import.meta.env.VITE_ORDER_API_URL?.trim();
  if (raw && /^https?:\/\//i.test(raw)) {
    if (import.meta.env.PROD) {
      try {
        const host = new URL(raw).hostname;
        if (host === "localhost" || host === "127.0.0.1") {
          return "/api/send-order";
        }
      } catch {
        return "/api/send-order";
      }
    }
    return raw;
  }
  return "/api/send-order";
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const primaryVideo = product.videos?.[0];
  const [step, setStep] = useState<ModalStep>("details");
  const [orderQuantityText, setOrderQuantityText] = useState("1");
  const [checkoutClientName, setCheckoutClientName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutAgreed, setCheckoutAgreed] = useState(false);

  const resetAllDrafts = () => {
    setOrderQuantityText("1");
    setCheckoutClientName("");
    setCheckoutPhone("");
    setCheckoutEmail("");
    setCheckoutAgreed(false);
    setStep("details");
  };

  const handleClose = () => {
    resetAllDrafts();
    onClose();
  };

  const handleBuy = () => {
    setStep("checkout");
  };

  const handleSubmitOrder = async () => {
    const qtyErr = validateOrderQuantity(orderQuantityText);
    if (qtyErr) {
      throw new Error("Некорректное количество в заказе.");
    }
    const quantity = parseInt(orderQuantityText.trim(), 10);
    const lineTotalFormatted = formatPriceUah(product.priceAmount * quantity);

    const url = resolveOrderApiUrl();
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          priceLabel: product.price,
          quantity,
          lineTotalFormatted,
          clientName: checkoutClientName.trim(),
          phone: checkoutPhone.trim(),
          email: checkoutEmail.trim(),
        }),
      });
    } catch {
      throw new Error(
        "Сервер недоступен. Для локальной проверки используйте npm run dev:vercel или задайте VITE_ORDER_API_URL.",
      );
    }

    let data: { success?: boolean; message?: string } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      /* ответ не JSON */
    }

    if (!res.ok || data.success !== true) {
      throw new Error(
        typeof data.message === "string" && data.message.length > 0
          ? data.message
          : "Не удалось отправить заказ. Попробуйте позже.",
      );
    }

    resetAllDrafts();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={handleClose} type="button">
          ✕
        </button>

        {step === "details" ? (
          <div className={styles.mainRow}>
            <div className={styles.mediaCol}>
              <div className={styles.thumb}>
                <img
                  src={product.image}
                  className={styles.image}
                  alt={product.title}
                  onClick={handleClose}
                />
              </div>

              <div className={styles.thumb}>
                {primaryVideo ? (
                  <video
                    className={styles.video}
                    controls
                    playsInline
                    preload="metadata"
                    poster={product.image}
                    controlsList="nodownload noplaybackrate"
                  >
                    <source src={primaryVideo} type="video/mp4" />
                  </video>
                ) : (
                  <div className={styles.noVideo}>
                    Видео для этой модели пока нет.
                  </div>
                )}
              </div>

              {product.videos && product.videos.length > 1 && (
                <div className={styles.moreVideos}>
                  {product.videos.slice(1).map((src) => (
                    <a
                      key={src}
                      className={styles.moreVideoLink}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Открыть доп. видео
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.textCol}>
              <h2 className={styles.title}>{product.title}</h2>
              <p className={styles.price}>{product.price}</p>
              <p className={styles.description}>{product.description}</p>
              <button
                className={styles.button}
                type="button"
                onClick={() => setStep("order")}
              >
                Заказать
              </button>
            </div>
          </div>
        ) : step === "order" ? (
          <ProductOrderForm
            product={product}
            onBack={() => setStep("details")}
            quantityText={orderQuantityText}
            onQuantityTextChange={setOrderQuantityText}
            onBuy={handleBuy}
          />
        ) : (
          <ProductCheckoutForm
            product={product}
            onBack={() => setStep("order")}
            clientName={checkoutClientName}
            onClientNameChange={setCheckoutClientName}
            phone={checkoutPhone}
            onPhoneChange={setCheckoutPhone}
            email={checkoutEmail}
            onEmailChange={setCheckoutEmail}
            agreed={checkoutAgreed}
            onAgreedChange={setCheckoutAgreed}
            onSubmitOrder={handleSubmitOrder}
          />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
