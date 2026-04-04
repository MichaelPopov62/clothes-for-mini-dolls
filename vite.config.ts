import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

/** Продакшен по умолчанию для прокси `/api` при `npm run dev` */
const DEFAULT_DEV_API_PROXY = "https://clothes-for-mini-dolls.vercel.app";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_DEV_API_PROXY_TARGET?.trim() || DEFAULT_DEV_API_PROXY;

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": { target: proxyTarget, changeOrigin: true },
      },
    },
  };
});
