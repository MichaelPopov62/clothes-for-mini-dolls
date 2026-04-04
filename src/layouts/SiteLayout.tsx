import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { smoothScrollToId } from "@/utils";
import appStyles from "@/App.module.css";

/** Общая оболочка: шапка, контент страницы, подвал */
const SiteLayout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (id) {
      const t = window.setTimeout(() => smoothScrollToId(id), 0);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className={appStyles.app}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default SiteLayout;
