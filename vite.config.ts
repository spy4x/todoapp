import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { wsServerPlugin } from './src/lib/server/ws';

const config: UserConfig = {
  plugins: [sveltekit(), wsServerPlugin()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
};

export default config;
