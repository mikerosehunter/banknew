import { runFullMonitoring } from '../../lib/monitoringEngine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { bankId } = req.body || {};
    // Run non-blocking — respond immediately, let it run in background
    runFullMonitoring({ bankId }).catch(console.error);
    res.json({ success: true, message: 'Monitoring run started' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
