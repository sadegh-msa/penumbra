import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'production',
  root: path.resolve(import.meta.dirname, 'src'),
  server: {
    port: 3000,
    watchOptions: {
      ignored: /node_modules/,
      path: path.resolve(import.meta.dirname, 'src'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, 'src/index.html'),
      },
    },
    outDir: path.join(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: process.env.NODE_ENV === 'development',
  },
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [path.resolve(import.meta.dirname, 'src')],
      },
    },
  },
  plugins: []
});
