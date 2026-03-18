import express from 'express';
import cors from 'cors';
import { entitiesRouter } from './routes/entities';
import { activitiesRouter } from './routes/activities';
import { insightsRouter } from './routes/insights';
import { graphRouter } from './routes/graph';
import { syncRouter } from './routes/sync';
import { findingsRouter } from './routes/findings';
import { statsRouter } from './routes/stats';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/entities', entitiesRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/graph', graphRouter);
app.use('/api/sync', syncRouter);
app.use('/api/findings', findingsRouter);
app.use('/api/stats', statsRouter);

export { app };
