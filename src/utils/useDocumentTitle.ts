import { useEffect } from "react";
import { SITE_NAME } from "./siteMeta";

/**
 * Временно меняет document.title; при размонтировании восстанавливает предыдущий
 * или fallback (по умолчанию SITE_NAME).
 */
export function useDocumentTitle(
  title: string,
  fallbackAfterUnmount: string = SITE_NAME,
): void {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev || fallbackAfterUnmount;
    };
  }, [title, fallbackAfterUnmount]);
}
