"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const entities_1 = require("./routes/entities");
const activities_1 = require("./routes/activities");
const insights_1 = require("./routes/insights");
const graph_1 = require("./routes/graph");
const sync_1 = require("./routes/sync");
const findings_1 = require("./routes/findings");
const stats_1 = require("./routes/stats");
const runMock_1 = require("./connectors/runMock");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/entities', entities_1.entitiesRouter);
app.use('/api/activities', activities_1.activitiesRouter);
app.use('/api/insights', insights_1.insightsRouter);
app.use('/api/graph', graph_1.graphRouter);
app.use('/api/sync', sync_1.syncRouter);
app.use('/api/findings', findings_1.findingsRouter);
app.use('/api/stats', stats_1.statsRouter);
// Seed with mock data on startup, then start server
(0, runMock_1.runMockConnector)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Org Connector API running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Failed to seed mock data:', err);
    process.exit(1);
});
