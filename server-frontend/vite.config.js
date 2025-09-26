import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // .env 파일 로드
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist'
    }
  })
}
