import { runAllConnectors } from './registry';
import './mockConnector';

/**
 * Run the mock connector and populate the store. Called on server startup.
 */
export function runMockConnector(): Promise<void> {
  return runAllConnectors();
}
