import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist/ai-front",
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  esbuild: {
    drop: ["console", "debugger"], // 删除 所有的console 和 debugger
  },
});
