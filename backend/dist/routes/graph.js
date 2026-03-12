"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphRouter = void 0;
const express_1 = require("express");
const graphBuilder_1 = require("../services/graphBuilder");
exports.graphRouter = (0, express_1.Router)();
exports.graphRouter.get('/', (_req, res) => {
    const graph = (0, graphBuilder_1.buildGraph)();
    res.json(graph);
});
