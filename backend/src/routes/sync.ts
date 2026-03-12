import { Router } from 'express';
import { runAllConnectors } from '../connectors/registry';

export const syncRouter = Router();

syncRouter.post('/', async (_req, res) => {
  try {
    await runAllConnectors();
    res.json({ ok: true, message: 'Sync completed' });
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});
