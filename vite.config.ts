import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    TanStackRouterVite(),
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      jpg: {
        quality: 75,
      },
      webp: {
        lossless: true,
      },
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@admin": path.resolve(__dirname, "./src/page/admin"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    // chunk size warning limit adjustment not needed if we split correctly, but keeping it high to avoid noise for now
    chunkSizeWarningLimit: 1000,
    // Fail build on critical errors
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mantine: ["@mantine/core", "@mantine/hooks", "@mantine/form"],
          tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
        },
      },
      onwarn(warning, warn) {
        // Ignore circular dependencies from node_modules (library issues)
        if (
          warning.code === "CIRCULAR_DEPENDENCY" &&
          warning.message.includes("node_modules")
        ) {
          return;
        }
        // Fail build on unresolved imports (our code issues)
        if (
          warning.code === "UNRESOLVED_IMPORT" &&
          !warning.message.includes("node_modules")
        ) {
          throw new Error(warning.message);
        }
        warn(warning);
      },
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
