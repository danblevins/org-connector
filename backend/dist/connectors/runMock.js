"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMockConnector = runMockConnector;
const registry_1 = require("./registry");
require("./mockConnector");
/**
 * Run the mock connector and populate the store. Called on server startup.
 */
function runMockConnector() {
    return (0, registry_1.runAllConnectors)();
}
