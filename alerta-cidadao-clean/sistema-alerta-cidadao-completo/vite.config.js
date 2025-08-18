import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,          // expõe na rede
    port: 5173,          // usa sempre a 5173
    strictPort: true,    // não pula de porta
    hmr: { clientPort: 443 } // HMR via HTTPS do Codespaces
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
})
