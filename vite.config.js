import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/wp-content/uploads/react-app/',
  plugins: [react()],
})
