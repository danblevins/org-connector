import type { IConnector } from '../types';
import { store } from '../store';

const connectors: IConnector[] = [];

export function registerConnector(connector: IConnector): void {
  connectors.push(connector);
}

export function getConnectors(): IConnector[] {
  return [...connectors];
}

export async function runAllConnectors(): Promise<void> {
  store.clear();
  for (const c of connectors) {
    const result = await c.sync();
    store.upsertEntities(result.entities);
    store.upsertActivities(result.activities);
    if (result.relationships?.length) {
      store.upsertRelationships(result.relationships);
    }
  }
}
