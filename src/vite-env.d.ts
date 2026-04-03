/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Полный https-URL к API (только для `npm run dev` без vercel dev).
   * Не используйте localhost в значении при `vite build` для продакшена — попадёт в бандл и сломает заказы.
   */
  readonly VITE_ORDER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}


