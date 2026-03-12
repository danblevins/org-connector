"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRouter = void 0;
const express_1 = require("express");
const registry_1 = require("../connectors/registry");
exports.syncRouter = (0, express_1.Router)();
exports.syncRouter.post('/', async (_req, res) => {
    try {
        await (0, registry_1.runAllConnectors)();
        res.json({ ok: true, message: 'Sync completed' });
    }
    catch (err) {
        console.error('Sync failed:', err);
        res.status(500).json({ error: 'Sync failed' });
    }
});
