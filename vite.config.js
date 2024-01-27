import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  define: { 'process.env': process.env },
  plugins: [
    VitePWA({
      manifest: {
        name: 'Neohabit',
        short_name: 'Neohabit',
        id: '/?homescreen=1',
        description: 'A systemic, gradual habit-tracker',
        background_color: '#fff',
        theme_color: '#144e12',
        start_url: '.',
        dir: 'ltr',
        scope: 'https://neohabit.app',
        lang: 'en',
        orientation: 'portrait-primary',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Login',
            url: '/login',
          },
          {
            name: 'Signup',
            url: '/signup',
          },
          {
            name: 'Projects',
            url: '/projects',
            description: 'An overview of all your projects.',
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
            src: 'https://neohabit.app/assets/favicon.970f3779.ico',
            type: 'image/x-icon',
            sizes: '16x16 32x32',
          },
          {
            src: 'https://neohabit.app/assets/icon-192.1dbb93bc.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'https://neohabit.app/assets/icon-512.715b96c7.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'https://neohabit.app/assets/icon-192-maskable.b243faef.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: 'https://neohabit.app/assets/icon-512-maskable.aac61cda.png',
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
    port: 8080,
  },
});
