/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Полный https-URL к API при `npm run dev` без vercel dev.
   * В production в бандле localhost игнорируется — используется `/api/send-order`.
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


