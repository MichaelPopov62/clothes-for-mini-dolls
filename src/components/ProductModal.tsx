import type { ProductModalProps } from "../types";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
        <img
          src={product.image}
          className={styles.image}
          alt={product.title}
        />
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

