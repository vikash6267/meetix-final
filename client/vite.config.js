import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true })],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'src/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'src/ssl/cert.pem')),
    },
    port: 5173
  }
});

