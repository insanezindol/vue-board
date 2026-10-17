import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: 'localhost',
    // 기본 3000 포트 사용, 사용 중이면 다른 포트로 자동 변경
    port: 3000,
    strictPort: false
  },
  test: {
    environment: 'jsdom'
  }
})
