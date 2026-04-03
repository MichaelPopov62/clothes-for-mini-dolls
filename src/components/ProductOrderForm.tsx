import { useMemo, useState } from "react";
import type { ProductOrderFormProps } from "../types";
import { formatPriceUah } from "@/utils";
import { validateOrderQuantity } from "../utils/formValidation";
import styles from "./ProductOrderForm.module.css";

/** Одна позиция: название, количество, цена из каталога, сумма по строке */
const ProductOrderForm = ({
  product,
  onBack,
  quantityText,
  onQuantityTextChange,
  onBuy,
}: ProductOrderFormProps) => {
  const [qtyTouched, setQtyTouched] = useState(false);
  const [buyAttempted, setBuyAttempted] = useState(false);

  const qtyError = validateOrderQuantity(quantityText);
  const showQtyError = (qtyTouched || buyAttempted) && qtyError;

  const quantityParsed = useMemo(() => {
    const t = quantityText.trim();
    if (!/^\d+$/.test(t)) return null;
    const n = parseInt(t, 10);
    if (!Number.isFinite(n) || n < 1) return null;
    return n;
  }, [quantityText]);

  const lineTotal =
    quantityParsed != null ? product.priceAmount * quantityParsed : null;

  const qtyOk =
    (qtyTouched || buyAttempted) && !qtyError && quantityText.trim().length > 0;

  const handleQuantityChange = (value: string) => {
    if (value === "") {
      onQuantityTextChange("");
      return;
    }
    if (!/^\d+$/.test(value)) return;
    onQuantityTextChange(value);
  };

  const handleQuantityBlur = () => {
    onQuantityTextChange(quantityText.trim());
    setQtyTouched(true);
  };

  const handleBuyClick = () => {
    setBuyAttempted(true);
    if (validateOrderQuantity(quantityText) !== null) return;
    onBuy();
  };

  const qtyInputClass = showQtyError
    ? `${styles.qtyInput} ${styles.qtyInputError}`
    : qtyOk
        ? `${styles.qtyInput} ${styles.qtyInputValid}`
        : styles.qtyInput;

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
                <div className={styles.qtyCell}>
                  <label className={styles.visuallyHidden} htmlFor="order-qty">
                    Количество
                  </label>
                  <input
                    id="order-qty"
                    className={qtyInputClass}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    value={quantityText}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    onBlur={handleQuantityBlur}
                  />
                  {showQtyError ? (
                    <span className={styles.fieldError} role="alert">
                      {qtyError}
                    </span>
                  ) : null}
                </div>
              </td>
              <td data-label="Цена за ед.">{product.price}</td>
              <td data-label="Сумма" className={styles.cellTotal}>
                {lineTotal != null ? formatPriceUah(lineTotal) : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button type="button" className={styles.buyButton} onClick={handleBuyClick}>
        Купить
      </button>
    </div>
  );
};

export default ProductOrderForm;
