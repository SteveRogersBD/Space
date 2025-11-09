import { defineConfig } from 'vite';

export default defineConfig({
  // Ensure environment variables are loaded from .env file
  envDir: './',
  
  // Configure server settings
  server: {
    port: 3000,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
