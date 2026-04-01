import { useMemo, useState } from "react";
import type { CatalogProps, Product } from "../types";
import ProductCard from "./ProductCard";
import styles from "./Catalog.module.css";

const TABS: { id: Product["category"]; label: string }[] = [
  { id: "women", label: "Женское" },
  { id: "men", label: "Мужское" },
  { id: "couples", label: "Парное" },
];

const Catalog = ({ products, onSelectProduct }: CatalogProps) => {
  const [activeTab, setActiveTab] = useState<Product["category"]>("women");

  const filtered = useMemo(
    () => products.filter((p) => p.category === activeTab),
    [products, activeTab],
  );

  return (
    <section id="catalog" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Коллекция изделий</h2>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Категории изделий"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`catalog-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls="catalog-panel"
              className={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="catalog-panel"
          role="tabpanel"
          aria-labelledby={`catalog-tab-${activeTab}`}
          className={styles.panel}
        >
          {filtered.length === 0 ? (
            <p className={styles.empty}>
              В этой категории пока нет изделий.
            </p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onClick={() => onSelectProduct(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
