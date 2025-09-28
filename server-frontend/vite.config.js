import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const serverConfig = {
    host: '0.0.0.0',
    port: 3000
  };

  // 개발 모드에서만 proxy 설정 추가
  if (mode === 'development') {
    serverConfig.proxy = {
      '/api': {
        target: 'https://weather-clothes.store',
        changeOrigin: true,
      }
    };
  }

  return defineConfig({
    plugins: [react()],
    server: serverConfig,
    build: {
      outDir: 'dist'
    }
  });
}