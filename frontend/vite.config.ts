import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import requireTransform from 'vite-plugin-require-transform'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), requireTransform({})],
  server: {
    port: 3080
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '~/*': path.resolve(__dirname, './src')
    }
  }
})
