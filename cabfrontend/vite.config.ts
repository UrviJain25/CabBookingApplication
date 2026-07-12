import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },

  server: {
    port: 8081,
    proxy: {
      // Proxy /api-backend to the Spring Boot backend
      // This is an optional fallback if direct CORS calls don't work
    },
  },
});