import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/wp-content/uploads/react-app/',
  // base: '/wp-content/themes/your-theme/react-app/',
  base: '/',
  plugins: [react()],
})
