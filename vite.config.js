import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        react(),
        svgr({ exportAsDefault: true }),
    ],
    assetsInclude: ['**/*.glsl'], // 🧠 цей рядок залишаємо!
    server: {
        proxy: {
            '/api': 'http://localhost:4000', // 👈 проксі на твій сервер
        },
    },
});
