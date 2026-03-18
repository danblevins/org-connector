const serverless = require('serverless-http');

// Static require so Netlify's bundler includes the backend (backend must be built first)
const { app } = require('../../backend/dist/app');
const { runMockConnector } = require('../../backend/dist/connectors/runMock');

let seeded = false;

module.exports.handler = async (event, context) => {
  if (!seeded) {
    await runMockConnector();
    seeded = true;
  }
  return serverless(app)(event, context);
};
