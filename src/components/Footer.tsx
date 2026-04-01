import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer id="contacts" className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h3 className={styles.title}>Контакты</h3>
          <p className={styles.text}>📞 +380953451089</p>
          <p className={styles.text}>✉️ vdovinetslisa@gmail.com</p>
          <div className={styles.links}>
            <a
              href="https://www.instagram.com/elizavetavdovinets?igsh=MWF6ZnhwcGQzaHdzeQ=="
              className={styles.link}
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <svg className={styles.icon} aria-hidden="true">
                <use href="/assets/icon/symbol-defs.svg#icon-instagram" />
              </svg>
              Instagram
            </a>
            <a
              href="https://t.me/+380953451089"
              className={styles.link}
              aria-label="Telegram"
              target="_blank"
              rel="noreferrer"
            >
              <svg className={styles.icon} aria-hidden="true">
                <use href="/assets/icon/symbol-defs.svg#icon-telegram" />
              </svg>
              Telegram
            </a>
            <a
              href="https://www.facebook.com/share/1Dt5RFvcbx"
              className={styles.link}
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <svg className={styles.icon} aria-hidden="true">
                <use href="/assets/icon/symbol-defs.svg#icon-facebook2" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
        <div className={styles.copy}>
          © 2026 MiniModa Studio. Сделано с душой.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
