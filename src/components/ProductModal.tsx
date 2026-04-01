import type { ProductModalProps } from "../types";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            className={styles.image}
            alt={product.title}
            onClick={onClose}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.price}>{product.price}</p>
          <p className={styles.description}>{product.description}</p>
          <button className={styles.button}>Заказать</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

