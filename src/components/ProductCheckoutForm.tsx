import type { FormEvent } from "react";
import type { ProductCheckoutFormProps } from "../types";
import styles from "./ProductCheckoutForm.module.css";

/** Контакты и согласие перед отправкой заказа */
const ProductCheckoutForm = ({
  product,
  onBack,
  settlement,
  onSettlementChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  agreed,
  onAgreedChange,
  onSubmitOrder,
}: ProductCheckoutFormProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitOrder();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Данные клиента</h2>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Назад к оформлению заказа
      </button>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Адрес: населённый пункт</th>
                <th scope="col">Телефон клиента</th>
                <th scope="col">E-mail клиента</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Адрес: населённый пункт">
                  <label className={styles.visuallyHidden} htmlFor="checkout-settlement">
                    Адрес клиента, населённый пункт
                  </label>
                  <input
                    id="checkout-settlement"
                    className={styles.fieldInput}
                    type="text"
                    name="settlement"
                    autoComplete="address-level2"
                    required
                    value={settlement}
                    onChange={(e) => onSettlementChange(e.target.value)}
                  />
                </td>
                <td data-label="Телефон клиента">
                  <label className={styles.visuallyHidden} htmlFor="checkout-phone">
                    Телефон клиента
                  </label>
                  <input
                    id="checkout-phone"
                    className={styles.fieldInput}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                  />
                </td>
                <td data-label="E-mail клиента">
                  <label className={styles.visuallyHidden} htmlFor="checkout-email">
                    E-mail клиента
                  </label>
                  <input
                    id="checkout-email"
                    className={styles.fieldInput}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="checkout-agreed"
            className={styles.checkbox}
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgreedChange(e.target.checked)}
            required
          />
          <label className={styles.checkboxLabel} htmlFor="checkout-agreed">
            Ознакомлен с товаром «{product.title}», его описанием и свойствами
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Отправить заказ
        </button>
      </form>
    </div>
  );
};

export default ProductCheckoutForm;
