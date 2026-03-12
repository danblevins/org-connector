import { store } from '../store';

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  source: string;
  activityCount?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type?: string;
  weight?: number;
  /** Human-readable explanation of how nodes are connected */
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Build graph payload for the network visualization from the unified store.
 * Nodes = entities (with optional activity count). Edges = relationships + activity-derived links.
 */
export function buildGraph(): GraphData {
  const entities = store.getEntities();
  const relationships = store.getAllRelationships();
  const activities = store.getActivities();

  const nodeMap = new Map<string, GraphNode>();
  const edgeMap = new Map<string, GraphEdge>();

  // Add entity nodes
  for (const e of entities) {
    nodeMap.set(e.id, {
      id: e.id,
      name: e.name,
      type: e.type,
      source: e.source,
    });
  }

  // Count activities per entity for node weight
  for (const a of activities) {
    for (const eid of a.linkedEntityIds) {
      const node = nodeMap.get(eid);
      if (node) {
        node.activityCount = (node.activityCount ?? 0) + 1;
      }
    }
    if (a.author) {
      const node = nodeMap.get(a.author);
      if (node) node.activityCount = (node.activityCount ?? 0) + 1;
    }
  }

  const relationshipLabels: Record<string, string> = {
    member_of: 'Member of',
    owns: 'Owns',
    belongs_to: 'Belongs to',
  };

  // Add relationship edges
  for (const r of relationships) {
    if (nodeMap.has(r.sourceEntityId) && nodeMap.has(r.targetEntityId)) {
      const key = `${r.sourceEntityId}-${r.targetEntityId}-${r.type ?? 'link'}`;
      const existing = edgeMap.get(key);
      const label = relationshipLabels[r.type ?? ''] ?? r.type ?? 'Related';
      if (existing) existing.weight = (existing.weight ?? 1) + 1;
      else
        edgeMap.set(key, {
          source: r.sourceEntityId,
          target: r.targetEntityId,
          type: r.type,
          weight: 1,
          label,
        });
    }
  }

  // Derive edges from activities (entity co-occurrence)
  for (const a of activities) {
    const ids = [...new Set([...a.linkedEntityIds, a.author].filter(Boolean))] as string[];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        if (!nodeMap.has(ids[i]) || !nodeMap.has(ids[j])) continue;
        const key = `${ids[i]}-${ids[j]}-activity`;
        const existing = edgeMap.get(key);
        if (existing) {
          existing.weight = (existing.weight ?? 1) + 1;
          existing.label = `${existing.weight} shared activities`;
        } else
          edgeMap.set(key, {
            source: ids[i],
            target: ids[j],
            type: 'activity',
            weight: 1,
            label: '1 shared activity',
          });
      }
    }
  }

  // Refresh activity edge labels with final weight
  for (const e of edgeMap.values()) {
    if (e.type === 'activity' && e.weight != null && e.weight > 0) {
      e.label = e.weight === 1 ? '1 shared activity' : `${e.weight} shared activities`;
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
  };
}
