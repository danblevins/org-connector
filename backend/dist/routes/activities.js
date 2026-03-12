"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesRouter = void 0;
const express_1 = require("express");
const store_1 = require("../store");
exports.activitiesRouter = (0, express_1.Router)();
exports.activitiesRouter.get('/', (req, res) => {
    const { source, type, entityId, since, until } = req.query;
    const activities = store_1.store.getActivities({
        source: source,
        type: type,
        entityId: entityId,
        since: since,
        until: until,
    });
    res.json(activities);
});
exports.activitiesRouter.get('/:id/related', (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const related = store_1.store.getRelatedActivities(req.params.id, limit);
    res.json(related);
});
exports.activitiesRouter.get('/:id', (req, res) => {
    const activity = store_1.store.getActivity(req.params.id);
    if (!activity)
        return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
});
