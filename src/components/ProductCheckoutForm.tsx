import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ProductCheckoutFormProps } from "../types";
import { validateClientName, validateEmail, validatePhone } from "../utils/formValidation";
import styles from "./ProductCheckoutForm.module.css";

const ORDER_SUCCESS_MESSAGE =
  "Спасибо за покупку. С Вами свяжутся для уточнения всех условий.";
/** Пауза, чтобы пользователь успел прочитать сообщение, затем закрытие модалки */
const ORDER_SUCCESS_DISMISS_MS = 2800;

/** Контакты и согласие перед отправкой заказа */
const ProductCheckoutForm = ({
  product,
  onBack,
  clientName,
  onClientNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  agreed,
  onAgreedChange,
  onSubmitOrder,
  onAfterOrderSuccess,
}: ProductCheckoutFormProps) => {
  const [touched, setTouched] = useState({
    clientName: false,
    phone: false,
    email: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (submitError) {
      submitBtnRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [submitError]);

  useEffect(() => {
    if (!submitSuccess) return;
    successRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const t = window.setTimeout(() => {
      onAfterOrderSuccess();
    }, ORDER_SUCCESS_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [submitSuccess, onAfterOrderSuccess]);

  const nameError = validateClientName(clientName);
  const phoneError = validatePhone(phone);
  const emailError = validateEmail(email);

  const showNameError = (touched.clientName || submitAttempted) && nameError;
  const showPhoneError = (touched.phone || submitAttempted) && phoneError;
  const showEmailError = (touched.email || submitAttempted) && emailError;

  const nameOk =
    (touched.clientName || submitAttempted) && !nameError && clientName.trim().length > 0;
  const phoneOk = (touched.phone || submitAttempted) && !phoneError && phone.trim().length > 0;
  const emailOk = (touched.email || submitAttempted) && !emailError && email.trim().length > 0;

  const inputClass = (hasError: boolean, ok: boolean) => {
    if (hasError) return `${styles.fieldInput} ${styles.fieldInputError}`;
    if (ok) return `${styles.fieldInput} ${styles.fieldInputValid}`;
    return styles.fieldInput;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    if (nameError || phoneError || emailError) return;
    if (!agreed) return;
    requestAnimationFrame(() => {
      submitBtnRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmitOrder());
      setSubmitSuccess(true);
    } catch (err) {
      const msg =
        err instanceof Error && err.message.length > 0
          ? err.message
          : "Не удалось отправить заказ. Попробуйте позже.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Данные клиента</h2>

      {submitSuccess ? (
        <p
          ref={successRef}
          className={styles.submitSuccess}
          role="status"
          aria-live="polite"
        >
          {ORDER_SUCCESS_MESSAGE}
        </p>
      ) : (
        <>
          <button type="button" className={styles.backButton} onClick={onBack}>
            ← Назад к оформлению заказа
          </button>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Имя</th>
                <th scope="col">Телефон клиента</th>
                <th scope="col">E-mail клиента</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Имя">
                  <label className={styles.visuallyHidden} htmlFor="checkout-client-name">
                    Имя клиента
                  </label>
                  <div className={styles.fieldCell}>
                    <input
                      id="checkout-client-name"
                      className={inputClass(!!showNameError, nameOk)}
                      type="text"
                      name="clientName"
                      autoComplete="name"
                      value={clientName}
                      onChange={(e) => onClientNameChange(e.target.value)}
                      onBlur={() => {
                        onClientNameChange(clientName.trim().replace(/\s+/g, " "));
                        setTouched((p) => ({ ...p, clientName: true }));
                      }}
                    />
                    {showNameError ? (
                      <span className={styles.fieldError} role="alert">
                        {nameError}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td data-label="Телефон клиента">
                  <label className={styles.visuallyHidden} htmlFor="checkout-phone">
                    Телефон клиента
                  </label>
                  <div className={styles.fieldCell}>
                    <input
                      id="checkout-phone"
                      className={inputClass(!!showPhoneError, phoneOk)}
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) =>
                        onPhoneChange(e.target.value.replace(/\D/g, "").slice(0, 15))
                      }
                      onBlur={() => {
                        onPhoneChange(phone.trim());
                        setTouched((p) => ({ ...p, phone: true }));
                      }}
                    />
                    {showPhoneError ? (
                      <span className={styles.fieldError} role="alert">
                        {phoneError}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td data-label="E-mail клиента">
                  <label className={styles.visuallyHidden} htmlFor="checkout-email">
                    E-mail клиента
                  </label>
                  <div className={styles.fieldCell}>
                    <input
                      id="checkout-email"
                      className={inputClass(!!showEmailError, emailOk)}
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      onBlur={() => {
                        onEmailChange(email.trim());
                        setTouched((p) => ({ ...p, email: true }));
                      }}
                    />
                    {showEmailError ? (
                      <span className={styles.fieldError} role="alert">
                        {emailError}
                      </span>
                    ) : null}
                  </div>
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
          />
          <div className={styles.checkboxLabelWrap}>
            <label className={styles.checkboxLabel} htmlFor="checkout-agreed">
              Ознакомлен с товаром «{product.title}», его описанием и свойствами
            </label>
            {submitAttempted && !agreed ? (
              <span className={styles.fieldError} role="alert">
                Подтвердите ознакомление с товаром
              </span>
            ) : null}
          </div>
        </div>

        {submitError ? (
          <p className={styles.submitError} role="alert">
            {submitError}
          </p>
        ) : null}

        <button
          ref={submitBtnRef}
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка…" : "Отправить заказ"}
        </button>
      </form>
        </>
      )}
    </div>
  );
};

export default ProductCheckoutForm;
