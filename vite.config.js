import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

function copyStaticFolders() {
  const folders = ['js', 'image']

  return {
    name: 'copy-static-folders',
    closeBundle() {
      folders.forEach((folder) => {
        const source = resolve(__dirname, folder)
        const destination = resolve(__dirname, 'dist', folder)

        if (existsSync(source)) {
          cpSync(source, destination, { recursive: true })
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [copyStaticFolders()],
  server: {
    port: 8000,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        newArrivals: resolve(__dirname, 'new-arrivals.html'),
        productDetail: resolve(__dirname, 'product-detail.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html')
      }
    }
  }
})
