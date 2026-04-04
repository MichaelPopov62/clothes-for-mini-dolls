import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import SocialNetworkLinks from "./SocialNetworkLinks";
import { SITE_NAME } from "@/utils";

const Footer = () => {
  return (
    <footer id="contacts" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.contactsBlock}>
            <h3 className={styles.title}>Контакты</h3>
            <p className={styles.text}>📞 +380953451089</p>
            <p className={styles.text}>✉️ vdovinetslisa@gmail.com</p>
            <SocialNetworkLinks
              withLabel
              classNames={{
                list: styles.links,
                item: styles.linksItem,
                link: styles.link,
                icon: styles.icon,
              }}
            />
          </div>
          <nav className={styles.legal} aria-label="Правовая информация">
            <Link to="/privacy" className={styles.legalLink}>
              Конфиденциальность
            </Link>
            <Link to="/terms" className={styles.legalLink}>
              Условия использования
            </Link>
          </nav>
        </div>
        <div className={styles.copy}>
          © 2026 {SITE_NAME}. Сделано с душой.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
