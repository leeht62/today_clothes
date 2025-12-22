import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true // 이 부분이 핵심입니다! 웹소켓 프록시를 활성화합니다.
      }
    }
  }
  
  ,define: {
    global: 'window' 
  }
})
