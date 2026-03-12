"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("express");
const store_1 = require("../store");
exports.statsRouter = (0, express_1.Router)();
const DAYS = 14;
exports.statsRouter.get('/', (_req, res) => {
    const activities = store_1.store.getActivities();
    const byType = {};
    const now = new Date();
    const dayCounts = {};
    for (let d = 0; d < DAYS; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        const key = date.toISOString().slice(0, 10);
        dayCounts[key] = 0;
    }
    for (const a of activities) {
        byType[a.type] = (byType[a.type] ?? 0) + 1;
        const dateKey = a.timestamp.slice(0, 10);
        if (dateKey in dayCounts)
            dayCounts[dateKey]++;
    }
    const byDay = Object.entries(dayCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));
    res.json({ byType, byDay });
});
