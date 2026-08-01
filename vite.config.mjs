import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  mode: 'production',
  root: path.resolve(__dirname, 'src'),
  server: {
    port: 3000,
    watchOptions: {
      ignored: /node_modules/,
      path: path.resolve(__dirname, 'src'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
      },
    },
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: process.env.NODE_ENV === 'development',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [path.resolve(__dirname, 'src/styles')],
      },
    },
  },
  plugins: [
    tsconfigPaths(),
  ]
});
