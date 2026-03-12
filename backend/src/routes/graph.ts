import { Router } from 'express';
import { buildGraph } from '../services/graphBuilder';

export const graphRouter = Router();

graphRouter.get('/', (_req, res) => {
  const graph = buildGraph();
  res.json(graph);
});
