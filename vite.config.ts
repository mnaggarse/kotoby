import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimize build for smaller bundle size
    minify: "esbuild",
    // Enable chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          sqlite: ["@capacitor-community/sqlite"],
        },
      },
    },
    // Optimize asset handling
    assetsInlineLimit: 4096,
    // Remove source maps in production
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
});
