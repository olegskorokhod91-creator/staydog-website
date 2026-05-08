import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { defineConfig } from 'vite'

const ASSET_FOLDERS = ['logo', 'portfolio', 'video', 'ui']
const MIME_TYPES = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

function copyDir(source, destination) {
  if (!existsSync(source)) return
  mkdirSync(destination, { recursive: true })
  for (const entry of readdirSync(source)) {
    const sourcePath = join(source, entry)
    const destinationPath = join(destination, entry)
    if (statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, destinationPath)
    } else {
      copyFileSync(sourcePath, destinationPath)
    }
  }
}

function staydogAssetBridge() {
  const srcAssets = resolve(process.cwd(), 'src/assets')

  return {
    name: 'staydog-asset-bridge',
    configureServer(server) {
      server.middlewares.use('/assets', (request, response, next) => {
        const rawPath = decodeURIComponent((request.url || '').split('?')[0].replace(/^\/+/, ''))
        const pathParts = rawPath.split('/').filter(Boolean)
        if (pathParts[0] === 'assets') pathParts.shift()
        const urlPath = pathParts.join('/')
        const [folder] = pathParts
        if (!ASSET_FOLDERS.includes(folder)) {
          next()
          return
        }

        const filePath = resolve(srcAssets, urlPath)
        if (!filePath.startsWith(srcAssets) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
          response.statusCode = 404
          response.end('Asset not found')
          return
        }

        response.setHeader('Content-Type', MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream')
        response.end(readFileSync(filePath))
      })
    },
    closeBundle() {
      const destinationRoot = resolve(process.cwd(), 'dist/assets')
      for (const folder of ASSET_FOLDERS) {
        copyDir(resolve(srcAssets, folder), resolve(destinationRoot, folder))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), staydogAssetBridge()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react'
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
