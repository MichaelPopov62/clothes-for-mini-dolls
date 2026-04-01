import type { CatalogProps } from "../types";
import ProductCard from "./ProductCard";
import styles from "./Catalog.module.css";

const Catalog = ({ products, onSelectProduct }: CatalogProps) => {
  return (
    <section id="catalog" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Коллекция изделий</h2>
        <div className={styles.list}>
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => onSelectProduct(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;

