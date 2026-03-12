"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitiesRouter = void 0;
const express_1 = require("express");
const store_1 = require("../store");
exports.entitiesRouter = (0, express_1.Router)();
exports.entitiesRouter.get('/', (req, res) => {
    const { type, source } = req.query;
    const entities = store_1.store.getEntities({
        type: type,
        source: source,
    });
    res.json(entities);
});
exports.entitiesRouter.get('/:id', (req, res) => {
    const entity = store_1.store.getEntity(req.params.id);
    if (!entity)
        return res.status(404).json({ error: 'Entity not found' });
    res.json(entity);
});
