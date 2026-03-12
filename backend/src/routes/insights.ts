import { Router } from 'express';
import { store } from '../store';

export const insightsRouter = Router();

// GET /api/insights?q=keyword&source=...&type=...&since=...&limit=...
insightsRouter.get('/', (req, res) => {
  const { q, source, type, since, limit } = req.query;
  let activities = store.getActivities({
    source: source as string | undefined,
    type: type as string | undefined,
    since: since as string | undefined,
  });
  if (q && typeof q === 'string') {
    const lower = q.toLowerCase();
    activities = activities.filter(
      (a) =>
        (a.title?.toLowerCase().includes(lower)) ||
        (a.body?.toLowerCase().includes(lower))
    );
  }
  const max = limit ? Math.min(Number(limit), 100) : 50;
  const results = activities.slice(0, max).map((a) => {
    const relatedEntities = a.linkedEntityIds
      .map((id) => store.getEntity(id))
      .filter(Boolean);
    return { activity: a, relatedEntities };
  });
  res.json(results);
});
