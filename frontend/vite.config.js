import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    process: {
      env: {
        REACT_APP_STAGE: process.env.REACT_APP_STAGE,
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png'],
        name: 'Neohabit',
        short_name: 'Neohabit',
        id: '/?homescreen=1',
        description: 'A self-hosted, periodic habit-tracker',
        background_color: '#2d3333',
        theme_color: '#00c4cd',
        start_url: './projects',
        dir: 'ltr',
        scope: 'https://neohabit.app',
        lang: 'en',
        orientation: 'any',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Projects',
            url: '/projects',
            description: 'Your projects',
            icons: [{ src: 'trending-up-custom.png', sizes: '192x192' }],
          },
          {
            name: 'Overview',
            url: '/overview',
            description: 'Your habits',
            icons: [{ src: 'view-dashboard-custom.png', sizes: '192x192' }],
          },
        ],
        categories: ['health', 'productivity', 'utilities', 'lifestyle'],
        edge_side_panel: { preferred_width: 400 },
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
        handle_links: 'preferred',
        scope_extensions: [{ origin: 'https://*.neohabit.app' }],
        web_apps: [{ web_app_identity: 'https://neohabit.app/' }],
        icons: [
          {
            src: 'favicon.ico',
            type: 'image/x-icon',
            sizes: '48x48',
            purpose: 'any',
          },
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'icon-512-maskable.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
      },
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'Neohabit',
        },
      },
    }),
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 8080,
  },
});
