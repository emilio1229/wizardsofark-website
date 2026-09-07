// Lightweight static server (optional). Railway can use Dockerfile or this server.
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Wizards of Ark site running on port ${PORT}`);
});
