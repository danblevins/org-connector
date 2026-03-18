"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const runMock_1 = require("./connectors/runMock");
const PORT = process.env.PORT ?? 4000;
(0, runMock_1.runMockConnector)()
    .then(() => {
    app_1.app.listen(PORT, () => {
        console.log(`Org Connector API running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Failed to seed mock data:', err);
    process.exit(1);
});
