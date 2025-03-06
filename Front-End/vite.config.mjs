import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [react(), jsconfigPaths()],
    base: '/', // Root path for development
    define: {
      global: 'window',
      'process.env.NODE_ENV': JSON.stringify(mode) // Explicitly set NODE_ENV
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1')
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1')
        }
      ]
    },
    server: {
      open: true,
      port: 3000,
      hmr: {
        overlay: true // Show errors in the browser
      }
    },
    preview: {
      open: true,
      port: 5000 // Use a different port for production previews
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false
    },
    // esbuild: {
    //   drop: isProduction ? ['console', 'debugger'] : [] // Remove console/debugger in production
    // }
  };
});
