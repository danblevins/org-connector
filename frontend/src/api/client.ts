const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface Activity {
  id: string;
  source: string;
  type: string;
  title?: string;
  body?: string;
  timestamp: string;
  author?: string;
  linkedEntityIds: string[];
  metadata?: Record<string, unknown>;
}

export interface InsightItem {
  activity: Activity;
  relatedEntities: Entity[];
}

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

export interface Finding {
  id: string;
  type: string;
  title: string;
  description: string;
}

export const api = {
  getEntities: (params?: { type?: string; source?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Entity[]>(`/entities${q ? `?${q}` : ''}`);
  },
  getEntity: (id: string) => request<Entity>(`/entities/${id}`),
  getActivities: (params?: {
    source?: string;
    type?: string;
    entityId?: string;
    since?: string;
    until?: string;
  }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Activity[]>(`/activities${q ? `?${q}` : ''}`);
  },
  getActivity: (id: string) => request<Activity>(`/activities/${id}`),
  getRelatedActivities: (id: string, limit?: number) => {
    const q = limit != null ? `?limit=${limit}` : '';
    return request<Activity[]>(`/activities/${id}/related${q}`);
  },
  getInsights: (params?: { q?: string; source?: string; since?: string; limit?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<InsightItem[]>(`/insights${q ? `?${q}` : ''}`);
  },
  getGraph: () => request<GraphData>('/graph'),
  getFindings: () => request<Finding[]>('/findings'),
  getStats: () => request<{ byType: Record<string, number>; byDay: { date: string; count: number }[] }>('/stats'),
  sync: () => request<{ ok: boolean }>('/sync', { method: 'POST' }),
};
