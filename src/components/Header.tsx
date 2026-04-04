import styles from "./Header.module.css";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialNetworkLinks from "./SocialNetworkLinks";
import { SITE_NAME, smoothScrollToId } from "@/utils";

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
  const navigate = useNavigate();
  const location = useLocation();
  /* Полноэкранное меню при ширине < 768px (включая 320px) */
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [menuOpen, setMenuOpen] = useState(() => isMobile);

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, menuOpen]);

  const sectionLinks = useMemo(
    () => [
      { hash: "#about", label: "О мастере" },
      { hash: "#catalog", label: "Изделия" },
      { hash: "#contacts", label: "Контакты" },
    ],
    [],
  );

  const onLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (isMobile) setMenuOpen(true);
  };

  const onNavClick = () => {
    if (isMobile) setMenuOpen(false);
  };

  const onSectionLinkClick =
    (hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (location.pathname !== "/") return;
      e.preventDefault();
      smoothScrollToId(hash.slice(1));
      onNavClick();
    };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button type="button" className={styles.brand} onClick={onLogoClick}>
          {SITE_NAME}
        </button>

        <nav className={styles.nav} aria-label="Навигация">
          {sectionLinks.map((l) => (
            <Link
              key={l.hash}
              to={{ pathname: "/", hash: l.hash }}
              className={styles.link}
              onClick={onSectionLinkClick(l.hash)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <SocialNetworkLinks
          classNames={{
            list: styles.socialDesktop,
            item: styles.socialItem,
            link: styles.socialLink,
            icon: styles.socialIcon,
          }}
        />

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
              {SITE_NAME}
            </button>

            <nav className={styles.mobileNav} aria-label="Навигация">
              {sectionLinks.map((l) => (
                <Link
                  key={l.hash}
                  to={{ pathname: "/", hash: l.hash }}
                  className={styles.mobileLink}
                  onClick={onSectionLinkClick(l.hash)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <SocialNetworkLinks
              classNames={{
                list: styles.socialMobile,
                item: styles.socialItem,
                link: styles.socialLinkMobile,
                icon: styles.socialIcon,
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
