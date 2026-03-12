"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnector = registerConnector;
exports.getConnectors = getConnectors;
exports.runAllConnectors = runAllConnectors;
const store_1 = require("../store");
const connectors = [];
function registerConnector(connector) {
    connectors.push(connector);
}
function getConnectors() {
    return [...connectors];
}
async function runAllConnectors() {
    store_1.store.clear();
    for (const c of connectors) {
        const result = await c.sync();
        store_1.store.upsertEntities(result.entities);
        store_1.store.upsertActivities(result.activities);
        if (result.relationships?.length) {
            store_1.store.upsertRelationships(result.relationships);
        }
    }
}
