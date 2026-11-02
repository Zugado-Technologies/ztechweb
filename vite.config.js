import { resolve } from 'path';
import { defineConfig } from 'vite';

function htmlBasePlugin() {
  let base = '/';
  return {
    name: 'html-base-plugin',
    configResolved(config) {
      base = config.base || '/';
    },
    transformIndexHtml(html) {
      if (base === '/' || base === './') return html;
      const cleanBase = base.replace(/\/$/, '');
      return html
        .replace(/href="\/([^"]*)"/g, (match, path) => {
          if (path.startsWith('http') || path.startsWith('//') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) return match;
          if (path.startsWith(cleanBase.replace(/^\//, ''))) return match;
          return `href="${cleanBase}/${path}"`;
        })
        .replace(/src="\/([^"]*)"/g, (match, path) => {
          if (path.startsWith('http') || path.startsWith('//')) return match;
          if (path.startsWith(cleanBase.replace(/^\//, ''))) return match;
          return `src="${cleanBase}/${path}"`;
        });
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [htmlBasePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        company: resolve(__dirname, 'company/index.html'),
        products: resolve(__dirname, 'products/index.html'),
        zugado: resolve(__dirname, 'products/zugado/index.html'),
        labs: resolve(__dirname, 'labs/index.html'),
        mindVault: resolve(__dirname, 'labs/mind-vault/index.html'),
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
