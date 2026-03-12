import { Router } from 'express';
import { store } from '../store';

export const statsRouter = Router();

const DAYS = 14;

statsRouter.get('/', (_req, res) => {
  const activities = store.getActivities();
  const byType: Record<string, number> = {};
  const now = new Date();
  const dayCounts: Record<string, number> = {};

  for (let d = 0; d < DAYS; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const key = date.toISOString().slice(0, 10);
    dayCounts[key] = 0;
  }

  for (const a of activities) {
    byType[a.type] = (byType[a.type] ?? 0) + 1;
    const dateKey = a.timestamp.slice(0, 10);
    if (dateKey in dayCounts) dayCounts[dateKey]++;
  }

  const byDay = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  res.json({ byType, byDay });
});
