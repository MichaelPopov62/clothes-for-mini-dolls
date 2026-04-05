import type { ProductCardProps } from "../types";
import { formatArticleDisplay } from "@/utils";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      className={styles.card}
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.title}
        className={styles.image}
      />
      <div className={styles.body}>
        <p className={styles.article}>{formatArticleDisplay(product.article)}</p>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

