// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
app.use(helmet());
app.use(cors()); // allow your static site to call this proxy
app.use(express.json());
app.use(morgan('tiny'));

// Basic in-memory cache (TTL in ms)
const cache = new Map();
const CACHE_TTL = process.env.CACHE_TTL_MS ? parseInt(process.env.CACHE_TTL_MS, 10) : 15 * 1000; // 15s default

// Rate limiter: adjust points/duration as needed
const rateLimiter = new RateLimiterMemory({
  points: process.env.RATE_LIMIT_POINTS ? parseInt(process.env.RATE_LIMIT_POINTS, 10) : 60,
  duration: process.env.RATE_LIMIT_DURATION ? parseInt(process.env.RATE_LIMIT_DURATION, 10) : 60
});

// Helper: fetch from BattleMetrics
async function fetchBattleMetrics(path) {
  const base = 'https://api.battlemetrics.com';
  const url = `${base}${path}`;
  const headers = {};

  // Optional API key usage (recommended)
  if (process.env.BATTLEMETRICS_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.BATTLEMETRICS_API_KEY}`;
  }

  const resp = await axios.get(url, { headers, timeout: 10000 });
  return resp.data;
}

// Endpoint: GET /api/servers/:id
app.get('/api/servers/:id', async (req, res) => {
  try {
    // Rate limiting per IP
    await rateLimiter.consume(req.ip);

    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing server id' });

    const cacheKey = `server:${id}`;
    const now = Date.now();

    // Serve from cache if fresh
    if (cache.has(cacheKey)) {
      const entry = cache.get(cacheKey);
      if (now - entry.ts < CACHE_TTL) {
        return res.json({ cached: true, data: entry.data });
      }
    }

    // Fetch from BattleMetrics
    const data = await fetchBattleMetrics(`/servers/${encodeURIComponent(id)}`);

    // Store in cache
    cache.set(cacheKey, { ts: now, data });

    // Return JSON
    res.json({ cached: false, data });
  } catch (err) {
    // Rate limiter error
    if (err instanceof Error && err.msBeforeNext) {
      return res.status(429).json({ error: 'Too many requests', retryAfter: err.msBeforeNext });
    }

    // Axios errors
    if (err.response) {
      const status = err.response.status;
      const body = err.response.data;
      return res.status(502).json({ error: 'Upstream error', status, body });
    }

    // Generic
    console.error('Proxy error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Internal proxy error', message: err.message || String(err) });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`BattleMetrics proxy listening on port ${port}`);
});
