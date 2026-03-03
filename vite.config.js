import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // En desarrollo, mock local; en prod, apunta a tu backend
      '/api/word-pack': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            // Fallback en desarrollo: devolver par local si no hay backend
            console.warn('Backend proxy error, usando fallback local:', err.message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              packs: [
                {
                  secretWord: 'falsa alarma',
                  decoyWord: 'verdadera fe',
                  aiContext: 'Falso positivo de seguridad'
                }
              ]
            }));
          });
        }
      }
    }
  }
});
