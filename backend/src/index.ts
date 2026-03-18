import { app } from './app';
import { runMockConnector } from './connectors/runMock';

const PORT = process.env.PORT ?? 4000;

runMockConnector()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Org Connector API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to seed mock data:', err);
    process.exit(1);
  });
