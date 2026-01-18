import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ❌ เอา base ของ GitHub Pages ออก
  // base: "/cinemanow-app/",
});
