import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      '@components': './src/lib/client/components',
      '@stores': './src/lib/client/stores',
      '@types': './src/lib/types',
    },
  },
};

export default config;
