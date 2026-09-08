// Production static server with reverse-proxy to the ASA monitor API.
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;
const API_ORIGIN = process.env.API_ORIGIN || 'http://127.0.0.1:3001';
const distPath = path.join(__dirname, 'dist');

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(
  '/api',
  createProxyMiddleware({
    target: API_ORIGIN,
    changeOrigin: true,
  }),
);

app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Wizards of Ark site running on port ${PORT} (API proxy → ${API_ORIGIN})`);
});
