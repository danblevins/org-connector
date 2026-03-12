/**
 * Unified data model for Org Connector.
 * All connectors map their data into these types.
 */
export type EntityType = 'person' | 'team' | 'project' | 'channel' | 'topic';
export interface Entity {
    id: string;
    name: string;
    type: EntityType;
    source: string;
    metadata?: Record<string, unknown>;
}
export type ActivityType = 'message' | 'task' | 'meeting_note' | 'summary' | 'other';
export interface Activity {
    id: string;
    source: string;
    type: ActivityType;
    title?: string;
    body?: string;
    timestamp: string;
    author?: string;
    linkedEntityIds: string[];
    metadata?: Record<string, unknown>;
}
export interface Relationship {
    id: string;
    sourceEntityId: string;
    targetEntityId: string;
    type?: string;
    metadata?: Record<string, unknown>;
}
export interface ConnectorResult {
    entities: Entity[];
    activities: Activity[];
    relationships?: Relationship[];
}
export interface IConnector {
    getSourceId(): string;
    sync(): Promise<ConnectorResult>;
}
