import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BabyMeal Planner',
        short_name: 'BabyMeal',
        description: '30-day meal planner for 7-month-old babies',
        theme_color: '#4a90d9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Build-time precache is automatically populated by vite-plugin-pwa.
        // The /api/plan endpoint is a runtime resource — it must be cached
        // explicitly here. CacheFirst: serve from cache, fall back to network.
        runtimeCaching: [
          {
            urlPattern: /\/api\/plan/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-plan-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
  },
});
