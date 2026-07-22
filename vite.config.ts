import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Strict CSP injected at build time only (the dev server needs inline
// scripts for HMR). connect-src 'self' is the technical enforcement of the
// "no data leaves the device" promise: the browser itself blocks any
// cross-origin request. There is no WebAssembly or Worker in this tool
// (pure JS/TS computation), so the policy stays minimal.
// style-src-attr covers inline style attributes (dynamic gauge widths).
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ");

function injectCsp(): Plugin {
  return {
    name: "inject-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "<meta charset=\"UTF-8\" />",
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

// Deployed under /outils/salaire/ on the CDS site; base must stay relative
// so the same build also works on GitHub Pages or a local preview.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    injectCsp(),
    VitePWA({
      registerType: "autoUpdate",
      // External registerSW.js file, not an inline script: keeps the strict
      // CSP (script-src 'self') intact.
      injectRegister: "script-defer",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
      manifest: {
        name: "Salaire brut / net France 2026",
        short_name: "Salaire net",
        description:
          "Convertissez salaire brut en net (et inversement) entièrement dans votre navigateur. Aucun envoi.",
        theme_color: "#ff6b00",
        background_color: "#0b0b0d",
        display: "standalone",
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
    }),
  ],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
