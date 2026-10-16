import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        company: resolve(__dirname, 'company/index.html'),
        products: resolve(__dirname, 'products/index.html'),
        zugado: resolve(__dirname, 'products/zugado/index.html'),
        labs: resolve(__dirname, 'labs/index.html'),
        mindBolt: resolve(__dirname, 'labs/mind-bolt/index.html'),
        contribute: resolve(__dirname, 'labs/contribute/index.html'),
        careers: resolve(__dirname, 'careers/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
