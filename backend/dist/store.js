"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
/**
 * In-memory unified store for entities, activities, and relationships.
 * Can be replaced with SQLite/Postgres later.
 */
class Store {
    constructor() {
        this.entities = new Map();
        this.activities = new Map();
        this.relationships = new Map();
    }
    clear() {
        this.entities.clear();
        this.activities.clear();
        this.relationships.clear();
    }
    // Entities
    upsertEntities(items) {
        for (const e of items) {
            this.entities.set(e.id, e);
        }
    }
    getEntity(id) {
        return this.entities.get(id);
    }
    getEntities(filters) {
        let list = Array.from(this.entities.values());
        if (filters?.type)
            list = list.filter((e) => e.type === filters.type);
        if (filters?.source)
            list = list.filter((e) => e.source === filters.source);
        return list;
    }
    // Activities
    upsertActivities(items) {
        for (const a of items) {
            this.activities.set(a.id, a);
        }
    }
    getActivity(id) {
        return this.activities.get(id);
    }
    /** Activities that share at least one linked entity or author with the given activity (excluding itself). */
    getRelatedActivities(activityId, limit = 10) {
        const activity = this.activities.get(activityId);
        if (!activity)
            return [];
        const ids = new Set(activity.linkedEntityIds);
        if (activity.author)
            ids.add(activity.author);
        return this.getActivities()
            .filter((a) => a.id !== activityId && (a.linkedEntityIds.some((eid) => ids.has(eid)) || (a.author && ids.has(a.author))))
            .slice(0, limit);
    }
    getActivities(filters) {
        let list = Array.from(this.activities.values());
        if (filters?.source)
            list = list.filter((a) => a.source === filters.source);
        if (filters?.type)
            list = list.filter((a) => a.type === filters.type);
        if (filters?.entityId) {
            list = list.filter((a) => a.linkedEntityIds.includes(filters.entityId) ||
                a.author === filters.entityId);
        }
        if (filters?.since) {
            list = list.filter((a) => a.timestamp >= filters.since);
        }
        if (filters?.until) {
            list = list.filter((a) => a.timestamp <= filters.until);
        }
        return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    // Relationships
    upsertRelationships(items) {
        for (const r of items) {
            this.relationships.set(r.id, r);
        }
    }
    getRelationships(filters) {
        let list = Array.from(this.relationships.values());
        if (filters?.sourceEntityId) {
            list = list.filter((r) => r.sourceEntityId === filters.sourceEntityId);
        }
        if (filters?.targetEntityId) {
            list = list.filter((r) => r.targetEntityId === filters.targetEntityId);
        }
        return list;
    }
    getAllRelationships() {
        return Array.from(this.relationships.values());
    }
}
exports.store = new Store();
