import { Router } from 'express';
import { buildFindings } from '../services/findingsBuilder';

export const findingsRouter = Router();

findingsRouter.get('/', (_req, res) => {
  const findings = buildFindings();
  res.json(findings);
});
