'use strict';
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');

// ── Config ──────────────────────────────────────────────────────────────────
const PORT = 4000;
const JWT_SECRET = 'clickandverify-dev-secret-change-in-prod';
const API_KEY = 'test-api-key-12345';

// ── In-memory "database" ─────────────────────────────────────────────────────
let users = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', password: bcrypt.hashSync('password123', 10), role: 'admin', verified: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Test User', email: 'user@test.com', password: bcrypt.hashSync('user1234', 10), role: 'user', verified: true, createdAt: '2024-01-02T00:00:00Z' },
  { id: 3, name: 'Jane Smith', email: 'jane@test.com', password: bcrypt.hashSync('jane5678', 10), role: 'user', verified: true, createdAt: '2024-01-03T00:00:00Z' },
];
let nextId = 4;

let products = [
  { id: 1, name: 'Playwright Masterclass', price: 39.99, category: 'testing', stock: 50 },
  { id: 2, name: 'Selenium WebDriver Guide', price: 29.99, category: 'testing', stock: 100 },
  { id: 3, name: 'Cypress Pro Subscription', price: 49.99, category: 'testing', stock: 25 },
  { id: 4, name: 'REST Assured Cookbook', price: 24.99, category: 'api', stock: 75 },
  { id: 5, name: 'k6 Performance Testing', price: 34.99, category: 'performance', stock: 60 },
];

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'] }));
app.use(express.json());

// ── Request logger ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Bearer token' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(403).json({ error: 'Invalid or missing API key. Use X-API-Key header.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  next();
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    error: 'Rate limit exceeded',
    limit: 5,
    window: '1 minute',
    retryAfter: Math.ceil(60 - (Date.now() % 60000) / 1000),
  }),
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, refreshToken, user: safeUser });
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    if (decoded.type !== 'refresh') throw new Error('Not a refresh token');
    const user = users.find(u => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Refresh token expired or invalid' });
  }
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json({ data: safeUser });
});

// ── USERS ─────────────────────────────────────────────────────────────────────
app.get('/api/users', requireAuth, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const search = (req.query.search || '').toLowerCase();
  const role = req.query.role;

  let filtered = users.map(({ password: _, ...u }) => u);
  if (search) filtered = filtered.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  if (role) filtered = filtered.filter(u => u.role === role);

  const total = filtered.length;
  const data = filtered.slice((page - 1) * limit, page * limit);
  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

app.get('/api/users/:id', requireAuth, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json({ data: safeUser });
});

app.post('/api/users', requireAuth, requireAdmin, (req, res) => {
  const { name, email, password, role = 'user' } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password are required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
  const newUser = { id: nextId++, name, email, password: bcrypt.hashSync(password, 10), role, verified: false, createdAt: new Date().toISOString() };
  users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json({ data: safe });
});

app.put('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email, role } = req.body || {};
  users[idx] = { ...users[idx], name: name || users[idx].name, email: email || users[idx].email, role: role || users[idx].role };
  const { password: _, ...safe } = users[idx];
  res.json({ data: safe });
});

app.patch('/api/users/:id', requireAuth, (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const updates = req.body || {};
  delete updates.password; delete updates.id;
  users[idx] = { ...users[idx], ...updates };
  const { password: _, ...safe } = users[idx];
  res.json({ data: safe });
});

app.delete('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (users[idx].id === req.user.sub) return res.status(400).json({ error: 'Cannot delete yourself' });
  users.splice(idx, 1);
  res.status(204).send();
});

// ── PRODUCTS (API key auth) ───────────────────────────────────────────────────
app.get('/api/products', requireApiKey, (req, res) => {
  const { category } = req.query;
  let data = category ? products.filter(p => p.category === category) : products;
  res.json({ data, total: data.length });
});

app.get('/api/products/:id', requireApiKey, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ data: product });
});

// ── CHAOS endpoint ────────────────────────────────────────────────────────────
app.get('/api/chaos', (req, res) => {
  const roll = Math.random();
  if (roll < 0.33) {
    return res.status(500).json({ error: 'Something went wrong (simulated chaos)', requestId: `req_${Date.now()}`, roll: Math.round(roll * 100) });
  }
  if (roll < 0.55) {
    res.setHeader('Retry-After', '5');
    return res.status(503).json({ error: 'Service temporarily unavailable', retryAfter: 5, roll: Math.round(roll * 100) });
  }
  res.json({ status: 'ok', message: 'You got lucky!', roll: Math.round(roll * 100), timestamp: new Date().toISOString() });
});

// ── Rate-limited endpoint ─────────────────────────────────────────────────────
app.get('/api/rate-limited', rateLimitMiddleware, (req, res) => {
  res.json({ data: 'Rate limit test data — success!', requestsLeft: 5 - parseInt(res.getHeader('X-RateLimit-Remaining') || '0'), timestamp: new Date().toISOString() });
});

// ── Download endpoints ────────────────────────────────────────────────────────
app.get('/api/download/csv', requireAuth, (req, res) => {
  const rows = users.map(u => `${u.id},${u.name},${u.email},${u.role}`);
  const csv = ['id,name,email,role', ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
  res.send(csv);
});

app.get('/api/download/json', requireAuth, (req, res) => {
  const data = users.map(({ password: _, ...u }) => u);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="users.json"');
  res.json({ data, exportedAt: new Date().toISOString() });
});

// ── OpenAPI spec ──────────────────────────────────────────────────────────────
app.get('/api/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'ClickAndVerify API', version: '1.0.0', description: 'REST API for automation testing practice' },
    servers: [{ url: 'http://localhost:4000', description: 'Local dev server' }],
    paths: {
      '/api/auth/login': { post: { summary: 'Login', tags: ['Auth'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'JWT token' }, 401: { description: 'Invalid credentials' } } } },
      '/api/users': { get: { summary: 'List users', tags: ['Users'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Paginated user list' }, 401: { description: 'Unauthorized' } } } },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        apiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      },
    },
  });
});

// ── WebSocket ─────────────────────────────────────────────────────────────────
const wss = new WebSocketServer({ server, path: '/ws' });
let counter = 0;
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);
  ws.send(JSON.stringify({ type: 'system', content: 'Connected to ClickAndVerify WebSocket', ts: Date.now() }));

  const counterInterval = setInterval(() => {
    counter += Math.floor(Math.random() * 3) + 1;
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'counter', value: counter, ts: Date.now() }));
    }
  }, 1000);

  const notifMessages = ['Build passed ✓', 'New PR opened', 'Deployment complete', 'Test suite finished', 'Coverage report ready'];
  const notifInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'notification', content: notifMessages[Math.floor(Math.random() * notifMessages.length)], ts: Date.now() }));
    }
  }, 5000);

  const chatUsers = ['Alice', 'Bob', 'Carol', 'Dave'];
  const chatMessages = ['Tests are passing', 'Found a flaky test', 'Deploying to staging', 'PR review done', 'All green!'];
  const chatInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'chat', from: chatUsers[Math.floor(Math.random() * chatUsers.length)], content: chatMessages[Math.floor(Math.random() * chatMessages.length)], ts: Date.now() }));
    }
  }, 2500);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('[WS] Received:', msg);
      ws.send(JSON.stringify({ type: 'echo', content: `Echo: ${msg.content || data}`, ts: Date.now() }));
    } catch {
      ws.send(JSON.stringify({ type: 'echo', content: `Echo: ${data}`, ts: Date.now() }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    clearInterval(counterInterval);
    clearInterval(notifInterval);
    clearInterval(chatInterval);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });

  ws.on('error', () => {
    clients.delete(ws);
    clearInterval(counterInterval);
    clearInterval(notifInterval);
    clearInterval(chatInterval);
  });
});

// ── Reset endpoint ────────────────────────────────────────────────────────────
app.post('/api/reset', (req, res) => {
  users = [
    { id: 1, name: 'Admin User', email: 'admin@test.com', password: bcrypt.hashSync('password123', 10), role: 'admin', verified: true, createdAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Test User', email: 'user@test.com', password: bcrypt.hashSync('user1234', 10), role: 'user', verified: true, createdAt: '2024-01-02T00:00:00Z' },
    { id: 3, name: 'Jane Smith', email: 'jane@test.com', password: bcrypt.hashSync('jane5678', 10), role: 'user', verified: true, createdAt: '2024-01-03T00:00:00Z' },
  ];
  nextId = 4;
  counter = 0;
  res.json({ message: 'Data reset to defaults' });
});

// ── 404 catch ─────────────────────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.path}` });
});

// ── Serve client (SPA) when built in `dist` ───────────────────────────────────
const clientDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n⚡ ClickAndVerify API Server`);
  console.log(`   HTTP:  http://localhost:${PORT}`);
  console.log(`   WS:    ws://localhost:${PORT}/ws`);
  console.log(`   Docs:  http://localhost:${PORT}/api/openapi.json\n`);
  console.log(`   Test accounts:`);
  console.log(`   - admin@test.com / password123  (admin)`);
  console.log(`   - user@test.com / user1234       (user)`);
  console.log(`   - API Key: test-api-key-12345\n`);
});
