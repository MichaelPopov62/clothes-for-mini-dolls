import { useMemo, useState } from "react";
import type { CatalogProps, Product } from "../types";
import ProductCard from "./ProductCard";
import styles from "./Catalog.module.css";
import { smoothScrollToId } from "../utils/scroll";

const TABS: { id: Product["category"]; label: string }[] = [
  { id: "women", label: "Женское" },
  { id: "men", label: "Мужское" },
  { id: "couples", label: "Парное" },
];

const PAGE_SIZE_BY_CATEGORY: Record<Product["category"], number> = {
  women: 12,
  men: 12,
  couples: 12,
};

type PageToken = number | "ellipsis";

function getPageTokens(
  current: number,
  total: number,
  siblingCount = 2,
): PageToken[] {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const first = 1;
  const last = total;

  const start = Math.max(first + 1, current - siblingCount);
  const end = Math.min(last - 1, current + siblingCount);

  const tokens: PageToken[] = [first];

  if (start > first + 1) tokens.push("ellipsis");
  for (let p = start; p <= end; p++) tokens.push(p);
  if (end < last - 1) tokens.push("ellipsis");

  tokens.push(last);
  return tokens;
}

const Catalog = ({ products, onSelectProduct }: CatalogProps) => {
  const [activeTab, setActiveTab] = useState<Product["category"]>("women");
  const [pageByCategory, setPageByCategory] = useState<
    Record<Product["category"], number>
  >({
    women: 1,
    men: 1,
    couples: 1,
  });

  const filtered = useMemo(
    () => products.filter((p) => p.category === activeTab),
    [products, activeTab],
  );

  const pageSize = PAGE_SIZE_BY_CATEGORY[activeTab];
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = pageByCategory[activeTab];
  const page = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const setPage = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setPageByCategory((prev) => ({ ...prev, [activeTab]: clamped }));
    smoothScrollToId("catalog");
  };

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
            <p className={styles.empty}>В этой категории пока нет изделий.</p>
          ) : (
            <>
              <div className={styles.grid}>
                {pageItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onClick={() => onSelectProduct(item)}
                  />
                ))}
              </div>

              <div className={styles.pagination} aria-label="Пагинация">
                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  aria-label="Предыдущая страница"
                >
                  ‹
                </button>

                <div
                  className={styles.pageChips}
                  role="list"
                  aria-label="Страницы"
                >
                  {getPageTokens(page, totalPages, 2).map((t, idx) => {
                    if (t === "ellipsis") {
                      return (
                        <span
                          key={`e-${idx}`}
                          className={styles.ellipsis}
                          aria-hidden="true"
                        >
                          …
                        </span>
                      );
                    }

                    const isActive = t === page;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={
                          isActive ? styles.pageChipActive : styles.pageChip
                        }
                        onClick={() => setPage(t)}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Страница ${t}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className={styles.pageArrow}
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  aria-label="Следующая страница"
                >
                  ›
                </button>
              </div>

              <button
                type="button"
                className={styles.toTop}
                onClick={() => smoothScrollToId("catalog")}
              >
                Вверх к каталогу
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
