import { Router } from 'express';
import { store } from '../store';

export const activitiesRouter = Router();

activitiesRouter.get('/', (req, res) => {
  const { source, type, entityId, since, until } = req.query;
  const activities = store.getActivities({
    source: source as string | undefined,
    type: type as string | undefined,
    entityId: entityId as string | undefined,
    since: since as string | undefined,
    until: until as string | undefined,
  });
  res.json(activities);
});

activitiesRouter.get('/:id/related', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const related = store.getRelatedActivities(req.params.id, limit);
  res.json(related);
});

activitiesRouter.get('/:id', (req, res) => {
  const activity = store.getActivity(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json(activity);
});
