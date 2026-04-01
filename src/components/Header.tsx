import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>MiniModa Studio</div>
        <nav className={styles.nav}>
          <a href="#about" className={styles.link}>
            О мастере
          </a>
          <a href="#catalog" className={styles.link}>
            Изделия
          </a>
          <a href="#contacts" className={styles.link}>
            Контакты
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

