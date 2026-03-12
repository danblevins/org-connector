"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insightsRouter = void 0;
const express_1 = require("express");
const store_1 = require("../store");
exports.insightsRouter = (0, express_1.Router)();
// GET /api/insights?q=keyword&source=...&type=...&since=...&limit=...
exports.insightsRouter.get('/', (req, res) => {
    const { q, source, type, since, limit } = req.query;
    let activities = store_1.store.getActivities({
        source: source,
        type: type,
        since: since,
    });
    if (q && typeof q === 'string') {
        const lower = q.toLowerCase();
        activities = activities.filter((a) => (a.title?.toLowerCase().includes(lower)) ||
            (a.body?.toLowerCase().includes(lower)));
    }
    const max = limit ? Math.min(Number(limit), 100) : 50;
    const results = activities.slice(0, max).map((a) => {
        const relatedEntities = a.linkedEntityIds
            .map((id) => store_1.store.getEntity(id))
            .filter(Boolean);
        return { activity: a, relatedEntities };
    });
    res.json(results);
});
