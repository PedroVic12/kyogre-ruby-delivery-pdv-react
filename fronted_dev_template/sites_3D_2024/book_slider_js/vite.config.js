import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // O diretório de saída
    assetsDir: 'assets', // O diretório para os arquivos estáticos
  },
})
