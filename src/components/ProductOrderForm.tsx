import { useMemo, useState } from "react";
import type { ProductOrderFormProps } from "../types";
import { formatPriceUah } from "../utils/formatPrice";
import styles from "./ProductOrderForm.module.css";

/** Одна позиция: название, количество, цена из каталога, сумма по строке */
const ProductOrderForm = ({ product, onBack }: ProductOrderFormProps) => {
  const [quantityText, setQuantityText] = useState("1");

  const quantity = useMemo(() => {
    if (quantityText === "") return 1;
    const n = parseInt(quantityText, 10);
    if (!Number.isFinite(n) || n < 1) return 1;
    return n;
  }, [quantityText]);

  const lineTotal = useMemo(
    () => product.priceAmount * quantity,
    [product.priceAmount, quantity],
  );

  const handleQuantityChange = (value: string) => {
    if (value === "") {
      setQuantityText("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    setQuantityText(value);
  };

  const handleQuantityBlur = () => {
    const n = parseInt(quantityText, 10);
    if (!Number.isFinite(n) || n < 1) {
      setQuantityText("1");
    } else {
      setQuantityText(String(n));
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Оформление заказа</h2>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Назад к товару
      </button>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Товар</th>
              <th scope="col">Количество</th>
              <th scope="col">Цена за ед.</th>
              <th scope="col">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Товар" className={styles.cellTitle}>
                {product.title}
              </td>
              <td data-label="Количество">
                <label className={styles.visuallyHidden} htmlFor="order-qty">
                  Количество
                </label>
                <input
                  id="order-qty"
                  className={styles.qtyInput}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={quantityText}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  onBlur={handleQuantityBlur}
                />
              </td>
              <td data-label="Цена за ед.">{product.price}</td>
              <td data-label="Сумма" className={styles.cellTotal}>
                {formatPriceUah(lineTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductOrderForm;
