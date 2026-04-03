/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Полный URL к API заказа для локального `npm run dev` без vercel dev */
  readonly VITE_ORDER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}


