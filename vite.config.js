import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // THÊM PHẦN NÀY VÀO
  server: {
    port: 3001, // Đổi cổng chạy của front-end (tùy chọn)
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', // Địa chỉ của Back-end
        changeOrigin: true,
      },
    },
  },
})
