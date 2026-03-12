import { useState, useEffect, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { api, type GraphData, type GraphNode, type Activity } from '../api/client';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import './Network.css';

type GraphObj = { id: string; name: string; type: string; source: string; activityCount?: number };
type LinkObj = { source: GraphObj; target: GraphObj; type?: string; weight?: number; label?: string };

const NODE_TYPE_ORDER = ['person', 'team', 'project', 'channel', 'topic'];

export function Network() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodeActivities, setNodeActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [filterNodeIds, setFilterNodeIds] = useState<Set<string>>(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    api.getGraph().then(setGraph).catch(console.error).finally(() => setLoading(false));
  }, []);

  const loadNodeDetail = useCallback((nodeId: string) => {
    setSelectedNode(graph?.nodes.find((n) => n.id === nodeId) ?? null);
    setSelectedConnection(null);
    api.getActivities({ entityId: nodeId })
      .then((activities) => setNodeActivities(activities.slice(0, 15)))
      .catch(() => setNodeActivities([]));
  }, [graph?.nodes]);

  const fullGraphData = useMemo(() => {
    if (!graph) return { nodes: [] as GraphObj[], links: [] as LinkObj[] };
    const nodes: GraphObj[] = graph.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      source: n.source,
      activityCount: n.activityCount,
    }));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const links: LinkObj[] = graph.edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({
        source: nodeMap.get(e.source)!,
        target: nodeMap.get(e.target)!,
        type: e.type,
        weight: e.weight,
        label: e.label,
      }));
    return { nodes, links };
  }, [graph]);

  const graphData = useMemo(() => {
    if (!filterNodeIds.size) return fullGraphData;
    const idSet = filterNodeIds;
    const nodes = fullGraphData.nodes.filter((n) => idSet.has(n.id));
    const nodeIdSet = new Set(nodes.map((n) => n.id));
    const links = fullGraphData.links.filter(
      (l) => nodeIdSet.has(l.source.id) && nodeIdSet.has(l.target.id)
    );
    return { nodes, links };
  }, [fullGraphData, filterNodeIds]);

  const toggleFilterNode = useCallback((id: string) => {
    setFilterNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearFilter = useCallback(() => {
    setFilterNodeIds(new Set());
    setFilterPanelOpen(false);
  }, []);

  useEffect(() => {
    if (filterNodeIds.size > 0 && selectedNode && !filterNodeIds.has(selectedNode.id)) {
      setSelectedNode(null);
      setNodeActivities([]);
      setSelectedConnection(null);
    }
  }, [filterNodeIds, selectedNode]);

  const nodesByType = useMemo(() => {
    if (!graph) return [];
    const search = filterSearch.toLowerCase().trim();
    const filtered = search
      ? graph.nodes.filter((n) => n.name.toLowerCase().includes(search))
      : graph.nodes;
    const byType = new Map<string, GraphNode[]>();
    for (const n of filtered) {
      const list = byType.get(n.type) ?? [];
      list.push(n);
      byType.set(n.type, list);
    }
    return NODE_TYPE_ORDER.filter((t) => byType.has(t)).map((type) => ({
      type,
      nodes: (byType.get(type) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [graph, filterSearch]);

  const connectionsForNode = selectedNode && graph
    ? graph.edges
        .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
        .map((e) => {
          const otherId = e.source === selectedNode.id ? e.target : e.source;
          const other = graph.nodes.find((n) => n.id === otherId);
          return {
            otherId,
            otherName: other?.name ?? otherId,
            label: e.label ?? 'Connected',
          };
        })
    : [];

  const sharedActivitiesForConnection = selectedConnection && nodeActivities.length > 0
    ? nodeActivities.filter((a) => a.linkedEntityIds.includes(selectedConnection) || a.author === selectedConnection)
    : [];

  const isLinkHighlighted = (source: GraphObj, target: GraphObj) => {
    if (!selectedNode || !selectedConnection) return false;
    const a = source.id;
    const b = target.id;
    return (a === selectedNode.id && b === selectedConnection) || (b === selectedNode.id && a === selectedConnection);
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNode || !selectedConnection) return false;
    return nodeId === selectedNode.id || nodeId === selectedConnection;
  };

  if (loading) {
    return (
      <div className="network-container">
        <div className="loading">Loading network...</div>
      </div>
    );
  }

  return (
    <div className="network-container">
      <header className="network-header">
        <h1>Organization Network</h1>
        <p className="subtitle">Entities and connections across teams, projects, and channels. Click a node to see how it connects.</p>
        <div className="graph-legend">
          <span className="legend-title">Connections:</span>
          <span className="legend-item"><span className="legend-dot legend-member" /> Member of (person → team)</span>
          <span className="legend-item"><span className="legend-dot legend-owns" /> Owns (team → project)</span>
          <span className="legend-item"><span className="legend-dot legend-channel" /> Belongs to (channel → team)</span>
          <span className="legend-item"><span className="legend-dot legend-activity" /> Shared activities (messages, tasks, meetings)</span>
        </div>

        <div className="filter-section">
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setFilterPanelOpen((o) => !o)}
            aria-expanded={filterPanelOpen}
          >
            {filterPanelOpen ? '▼' : '▶'} Focus on nodes
            {filterNodeIds.size > 0 && (
              <span className="filter-badge">Showing {filterNodeIds.size} of {graph?.nodes.length ?? 0}</span>
            )}
          </button>
          {filterNodeIds.size > 0 && (
            <button type="button" className="filter-clear" onClick={clearFilter}>
              Show all
            </button>
          )}
          {filterPanelOpen && graph && (
            <div className="filter-panel">
              <p className="filter-panel-hint">Select nodes to see only them and their connections. Clear selection to show the full graph.</p>
              <input
                type="search"
                className="filter-search"
                placeholder="Search nodes..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
              <div className="filter-list">
                {nodesByType.map(({ type, nodes }) => (
                  <div key={type} className="filter-group">
                    <span className="filter-group-label">{type.replace('_', ' ')}</span>
                    {nodes.map((n) => (
                      <label key={n.id} className="filter-node-item">
                        <input
                          type="checkbox"
                          checked={filterNodeIds.has(n.id)}
                          onChange={() => toggleFilterNode(n.id)}
                        />
                        <span>{n.name}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="network-content">
        <div className="graph-wrapper">
          <ForceGraph2D
            graphData={graphData}
            nodeId="id"
            nodeLabel="name"
            nodeAutoColorBy="type"
            nodeVal={(n) => {
              const node = n as GraphObj;
              const count = node.activityCount ?? 0;
              return 4 + Math.min(count * 0.8, 12);
            }}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.15}
            onNodeClick={(node) => loadNodeDetail((node as GraphObj).id)}
            backgroundColor="#f5f5f8"
            linkColor={(link) => {
              const l = link as LinkObj;
              return isLinkHighlighted(l.source, l.target) ? 'rgba(91, 107, 192, 0.9)' : 'rgba(100, 110, 140, 0.4)';
            }}
            linkWidth={(link) => {
              const l = link as LinkObj;
              return isLinkHighlighted(l.source, l.target) ? 3 : 1;
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const n = node as GraphObj;
              const label = n.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const size = (n.activityCount ?? 0) * 0.5 + 6;
              const x = (node.x ?? 0);
              const y = (node.y ?? 0);
              const highlighted = isNodeHighlighted(n.id);

              ctx.beginPath();
              ctx.arc(x, y, size + (highlighted ? 2 : 0), 0, 2 * Math.PI);
              ctx.fillStyle = (node as unknown as { __lineColor?: string }).__lineColor ?? '#5b6bc0';
              ctx.fill();
              ctx.strokeStyle = highlighted ? '#5b6bc0' : 'rgba(80, 90, 120, 0.5)';
              ctx.lineWidth = (highlighted ? 3 : 1) / globalScale;
              ctx.stroke();

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#2c2c34';
              ctx.fillText(label, x, y + size + (highlighted ? 2 : 0) + fontSize);
            }}
          />
        </div>
        {selectedNode && (
          <aside className="detail-panel">
            <button
              type="button"
              className="close-panel"
              onClick={() => {
                setSelectedNode(null);
                setNodeActivities([]);
                setSelectedConnection(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{selectedNode.name}</h2>
            <div className="detail-meta">
              <span className="type">{selectedNode.type}</span>
              <span className="source">{selectedNode.source}</span>
              {selectedNode.activityCount != null && (
                <span>{selectedNode.activityCount} activities</span>
              )}
            </div>
            {connectionsForNode.length > 0 && (
              <>
                <h3>How this connects</h3>
                <p className="detail-panel-hint">Click a connection to see shared activities and highlight it in the graph.</p>
                <ul className="connections-list">
                  {connectionsForNode.map((c) => (
                    <li key={c.otherId}>
                      <button
                        type="button"
                        className={`connection-row ${selectedConnection === c.otherId ? 'connection-row--selected' : ''}`}
                        onClick={() => setSelectedConnection(selectedConnection === c.otherId ? null : c.otherId)}
                      >
                        <strong>{c.otherName}</strong> — {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedConnection && sharedActivitiesForConnection.length > 0 && (
                  <div className="shared-activities">
                    <h4>Activities with {connectionsForNode.find((c) => c.otherId === selectedConnection)?.otherName}</h4>
                    <ul className="activity-list">
                      {sharedActivitiesForConnection.map((a) => (
                        <li key={a.id}>
                          <button
                            type="button"
                            className="activity-list-button"
                            onClick={() => setSelectedActivity(a)}
                          >
                            <span className="act-type">{a.type}</span>
                            {a.title || (a.body && a.body.slice(0, 60) + (a.body.length > 60 ? '…' : ''))}
                            <time>{new Date(a.timestamp).toLocaleDateString()}</time>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedConnection && sharedActivitiesForConnection.length === 0 && (
                  <p className="shared-activities-empty">No shared activities in this list. Try viewing more activity above.</p>
                )}
              </>
            )}
            <h3>Recent activity</h3>
            <p className="detail-panel-hint">Click an activity to see details and related activities.</p>
            <ul className="activity-list">
              {nodeActivities.length === 0 ? (
                <li className="muted">No recent activity</li>
              ) : (
                nodeActivities.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className="activity-list-button"
                      onClick={() => setSelectedActivity(a)}
                    >
                      <span className="act-type">{a.type}</span>
                      {a.title && <strong>{a.title}</strong>}
                      {!a.title && a.body && (
                        <span className="act-body">{a.body.slice(0, 80)}…</span>
                      )}
                      <time>{new Date(a.timestamp).toLocaleDateString()}</time>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>
        )}

      {selectedActivity && (
        <ActivityDetailModal
          activityId={selectedActivity.id}
          initialActivity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
      </div>
    </div>
  );
}
