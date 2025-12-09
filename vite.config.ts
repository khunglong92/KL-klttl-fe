import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
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
    chunkSizeWarningLimit: 4000, // Adjusted chunk size warning limit
    // Fail build on critical errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore circular dependencies from node_modules (library issues)
        if (warning.code === "CIRCULAR_DEPENDENCY" && warning.message.includes("node_modules")) {
          return;
        }
        // Fail build on unresolved imports (our code issues)
        if (warning.code === "UNRESOLVED_IMPORT" && !warning.message.includes("node_modules")) {
          throw new Error(warning.message);
        }
        warn(warning);
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
