import styles from "./Header.module.css";
import { useEffect, useMemo, useState } from "react";
import { smoothScrollToId } from "../utils/scroll";

const useMediaQuery = (query: string) => {
  const getMatches = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [menuOpen, setMenuOpen] = useState(() => isMobile);

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, menuOpen]);

  const links = useMemo(
    () => [
      { href: "#about", label: "О мастере" },
      { href: "#catalog", label: "Изделия" },
      { href: "#contacts", label: "Контакты" },
    ],
    [],
  );

  const onLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isMobile) setMenuOpen(true);
  };

  const onNavClick = () => {
    if (isMobile) setMenuOpen(false);
  };

  const onAnchorClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    smoothScrollToId(id);
    onNavClick();
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button type="button" className={styles.brand} onClick={onLogoClick}>
          MiniModa Studio
        </button>

        <nav className={styles.nav} aria-label="Навигация">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.link}
              onClick={onAnchorClick(l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.burgerLines} aria-hidden="true" />
        </button>
      </div>

      {isMobile && menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Меню">
          <div className={styles.mobileMenuInner}>
            <button
              type="button"
              className={styles.mobileLogo}
              onClick={onLogoClick}
            >
              MiniModa Studio
            </button>

            <nav className={styles.mobileNav} aria-label="Навигация">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={styles.mobileLink}
                  onClick={onAnchorClick(l.href)}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

