import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ["@tanstack/react-query", "@tanstack/react-query-devtools"],
  },
  server: {
    fs: {
      allow: ["."],
    },
    proxy: {
      "/.well-known": {
        target: "http://localhost:5173",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", () => {
            // Silently ignore errors for .well-known requests
          });
        }
      }
    }
  }
});
