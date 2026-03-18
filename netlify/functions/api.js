const serverless = require('serverless-http');
const path = require('path');

// Require built backend (must run after backend is built)
const { app } = require(path.join(__dirname, '../../backend/dist/app'));
const { runMockConnector } = require(path.join(__dirname, '../../backend/dist/connectors/runMock'));

let seeded = false;

module.exports.handler = async (event, context) => {
  if (!seeded) {
    await runMockConnector();
    seeded = true;
  }
  return serverless(app)(event, context);
};
