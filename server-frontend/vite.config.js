import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        // API 프록시 설정
        '/api': {
          target: 'http://13.124.79.106:8080', 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // WebSocket 프록시 설정
        '/ws': {
          target: 'http://13.124.79.106:8080',
          changeOrigin: true,
          ws: true, // WebSocket 프록시 활성화
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  });
};