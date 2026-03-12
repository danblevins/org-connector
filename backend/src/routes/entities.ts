import { Router } from 'express';
import { store } from '../store';

export const entitiesRouter = Router();

entitiesRouter.get('/', (req, res) => {
  const { type, source } = req.query;
  const entities = store.getEntities({
    type: type as string | undefined,
    source: source as string | undefined,
  });
  res.json(entities);
});

entitiesRouter.get('/:id', (req, res) => {
  const entity = store.getEntity(req.params.id);
  if (!entity) return res.status(404).json({ error: 'Entity not found' });
  res.json(entity);
});
