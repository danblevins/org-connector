import type { IConnector, Entity, Activity, Relationship } from '../types';
declare function mockEntities(): Entity[];
declare function mockActivities(): Activity[];
declare function mockRelationships(): Relationship[];
declare const mockConnector: IConnector;
export { mockConnector };
export { mockEntities, mockActivities, mockRelationships };
