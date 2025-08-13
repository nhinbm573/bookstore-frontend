/// <reference types="vitest/config" />

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  const plugins = [tailwindcss(), tsconfigPaths()];

  if (process.env.NODE_ENV !== "test") {
    plugins.push(reactRouter());
  }

  return {
    plugins: plugins,
    optimizeDeps: {
      include: [
        "@tanstack/react-query",
        "@tanstack/react-query-devtools",
        "lucide-react",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-select",
        "@radix-ui/react-dialog",
        "@radix-ui/react-label",
        "@radix-ui/react-separator",
        "react-hook-form",
        "zod",
        "@hookform/resolvers/zod",
        "zustand",
        "clsx",
        "tailwind-merge",
        "axios",
        "next-themes",
        "sonner",
        "react-google-recaptcha",
        "zustand/middleware",
        "@react-oauth/google",
      ],
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
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./setup-tests.ts"],
    },
  };
});
