"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findingsRouter = void 0;
const express_1 = require("express");
const findingsBuilder_1 = require("../services/findingsBuilder");
exports.findingsRouter = (0, express_1.Router)();
exports.findingsRouter.get('/', (_req, res) => {
    const findings = (0, findingsBuilder_1.buildFindings)();
    res.json(findings);
});
