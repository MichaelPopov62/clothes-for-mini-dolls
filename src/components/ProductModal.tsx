import { useState } from "react";
import type { ProductModalProps } from "../types";
import ProductOrderForm from "./ProductOrderForm";
import styles from "./ProductModal.module.css";

type ModalStep = "details" | "order";

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const primaryVideo = product.videos?.[0];
  const [step, setStep] = useState<ModalStep>("details");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} type="button">
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
                  onClick={onClose}
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
        ) : (
          <ProductOrderForm
            product={product}
            onBack={() => setStep("details")}
          />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
