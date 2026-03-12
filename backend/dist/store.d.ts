import type { Entity, Activity, Relationship } from './types';
/**
 * In-memory unified store for entities, activities, and relationships.
 * Can be replaced with SQLite/Postgres later.
 */
declare class Store {
    private entities;
    private activities;
    private relationships;
    clear(): void;
    upsertEntities(items: Entity[]): void;
    getEntity(id: string): Entity | undefined;
    getEntities(filters?: {
        type?: string;
        source?: string;
    }): Entity[];
    upsertActivities(items: Activity[]): void;
    getActivity(id: string): Activity | undefined;
    /** Activities that share at least one linked entity or author with the given activity (excluding itself). */
    getRelatedActivities(activityId: string, limit?: number): Activity[];
    getActivities(filters?: {
        source?: string;
        type?: string;
        entityId?: string;
        since?: string;
        until?: string;
    }): Activity[];
    upsertRelationships(items: Relationship[]): void;
    getRelationships(filters?: {
        sourceEntityId?: string;
        targetEntityId?: string;
    }): Relationship[];
    getAllRelationships(): Relationship[];
}
export declare const store: Store;
export {};
