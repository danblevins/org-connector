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
export declare function buildGraph(): GraphData;
