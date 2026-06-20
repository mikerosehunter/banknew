// Simple Express server for local development
// Serves the API on port 3000 — Vite proxies /api here
require('dotenv').config({ path: '.env.local' });
const app = require('./api/index.js');
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}/api`);
});
