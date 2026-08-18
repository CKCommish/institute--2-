import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://lionforuminstitute.org',
  server: { port: 4321, host: true },
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
