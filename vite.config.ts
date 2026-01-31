import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ExamMaker/", // ← GitHub repo 이름과 대소문자까지 정확히 일치
});
