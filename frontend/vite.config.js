import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import fs from 'fs'
import frappeui from 'frappe-ui/vite'
import { VitePWA } from 'vite-plugin-pwa'

function appPath(app) {
  const root = path.resolve(__dirname, '../..') // points to apps
  const frontendPaths = [
    // Standard frontend structure: appname/frontend/src
    path.join(root, app, 'frontend', 'src'),
    // Desk-based apps: appname/desk/src
    path.join(root, app, 'desk', 'src'),
    // Alternative frontend structures
    path.join(root, app, 'client', 'src'),
    path.join(root, app, 'ui', 'src'),
    // Direct src structure: appname/src
    path.join(root, app, 'src'),
  ]
  return frontendPaths.find((srcPath) => fs.existsSync(srcPath)) || null
}

function hasApp(app) {
  return fs.existsSync(appPath(app))
}

// List of frontend apps used in this project
let apps = []

const alias = [
  // Default "@" for this app
  {
    find: '@',
    replacement: path.resolve(__dirname, 'src'),
  },

  // App-specific aliases like @helpdesk, @hrms, etc.
  ...apps.map((app) =>
    hasApp(app)
      ? { find: `@${app}`, replacement: appPath(app) }
      : { find: `@${app}`, replacement: `virtual:${app}` },
  ),
]

const defineFlags = Object.fromEntries(
  apps.map((app) => [
    `__HAS_${app.toUpperCase()}__`,
    JSON.stringify(hasApp(app)),
  ]),
)

const virtualStubPlugin = {
  name: 'virtual-empty-modules',
  resolveId(id) {
    if (id.startsWith('virtual:')) return '\0' + id
  },
  load(id) {
    if (id.startsWith('\0virtual:')) {
      return 'export default {}; export const missing = true;'
    }
  },
}

console.log('Generated app aliases:', alias)
const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  define: defineFlags,
  plugins: [
    frappeui({
      frappeProxy: true,
      lucideIcons: true,
      jinjaBootData: true,
      buildConfig: {
        indexHtmlPath: '../crm/www/crm.html',
        emptyOutDir: true,
        sourcemap: false,
      },
    }),
    vue(),
    vueJsx(),
    ...(isProd
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
              enabled: false,
            },
            manifest: {
              display: 'standalone',
              name: 'Frappe CRM',
              short_name: 'Frappe CRM',
              start_url: '/crm',
              description:
                'Modern & 100% Open-source CRM tool to supercharge your sales operations',
              icons: [
                {
                  src: '/assets/crm/manifest/manifest-icon-192.maskable.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/assets/crm/manifest/manifest-icon-192.maskable.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'maskable',
                },
                {
                  src: '/assets/crm/manifest/manifest-icon-512.maskable.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/assets/crm/manifest/manifest-icon-512.maskable.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
                },
              ],
            },
          }),
        ]
      : []),
    virtualStubPlugin,
  ],
  resolve: { alias },
  build: {
    // Increase chunk size warning limit to reduce warnings
    chunkSizeWarningLimit: 3000,
    // Disable source maps to reduce memory usage
    sourcemap: false,
    // Use esbuild for minification (more memory efficient)
    minify: 'esbuild',
    // Target modern browsers to reduce bundle size
    target: 'es2017',
    cssCodeSplit: true,
    // Reduce memory usage during build
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
          pinia: ['pinia'],
          frappeui: ['frappe-ui'],
          vendor: ['lodash'],
        },
      },
      // Reduce memory usage by processing fewer files at once
      maxParallelFileOps: 2,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'frappe-ui',
    ],
    exclude: ['@twilio/voice-sdk', 'socket.io-client', 'lodash'], // Exclude large dependencies from pre-bundling
    // Reduce memory usage during pre-bundling
    force: false,
  },
})
