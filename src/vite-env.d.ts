/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Полный URL к API заказа (например https://....vercel.app/api/send-order) для локального vite без vercel dev */
  readonly VITE_ORDER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}


