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
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://t.me/+380953451089"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
            <a
              href="https://www.facebook.com/share/1Dt5RFvcbx"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
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
