import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const serverConfig = {
    host: '0.0.0.0',
    port: 80,
    port: 443
  };

  // 개발 모드에서만 proxy 설정 추가
    serverConfig.proxy = {
      '/api': {
        target: 'https://today-clothes.shop',
        changeOrigin: true,
      }
    };
  

  return defineConfig({
    plugins: [react()],
    server: serverConfig,
    build: {
      outDir: 'dist'
    }
  });
}