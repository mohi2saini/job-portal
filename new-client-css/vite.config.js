import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react(), ], // Include Tailwind CSS plugin for consistency
  css: {
    modules: false, // Ensures global CSS files are not treated as modules
  },
  define: {
    'process.env': {
      ...process.env,
      VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || 'http://localhost:5000', // Default to local backend on port 5000
    },
  },
  preview: {
    port: 4173, // Default Vite preview port, can be omitted
    allowedHosts: ['job-portal-2-67c4.onrender.com', 'localhost'], // Allow Render host and localhost
  },
});