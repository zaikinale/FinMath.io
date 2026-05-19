import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'  <-- УДАЛИТЕ или закомментируйте эту строку

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(),  <-- УДАЛИТЕ или закомментируйте эту строку
  ],
})