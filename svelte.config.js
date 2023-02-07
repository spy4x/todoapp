import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/kit/vite";

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
      '@services': './src/lib/client/services',
      '@types': './src/lib/types',
    },
  }
};

export default config;
