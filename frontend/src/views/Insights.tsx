import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api, type InsightItem, type Finding } from '../api/client';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import './Insights.css';

const CHART_COLORS = ['#5b6bc0', '#2e7d32', '#6a1b9a', '#1565c0', '#e65100', '#c62828'];

export function Insights() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [stats, setStats] = useState<{ byType: Record<string, number>; byDay: { date: string; count: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState<InsightItem | null>(null);

  useEffect(() => {
    api.getFindings().then(setFindings).catch(console.error);
  }, []);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = { limit: '50' };
    if (query) params.q = query;
    if (sourceFilter) params.source = sourceFilter;
    if (typeFilter) params.type = typeFilter;
    setLoading(true);
    api.getInsights(params)
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, sourceFilter, typeFilter]);

  const sources = [...new Set(insights.map((i) => i.activity.source))].sort();
  const activityTypes = ['message', 'task', 'meeting_note', 'summary', 'other'];

  return (
    <div className="insights">
      <header className="insights-header">
        <h1>Insights</h1>
        <p className="subtitle">Search and browse activities across the organization. Click a card to see details and related activities.</p>
        {findings.length > 0 && (
          <section className="findings-section" aria-label="Interesting connections and findings">
            <h2 className="findings-title">Interesting connections across the org</h2>
            <p className="findings-intro">Patterns and links you might not spot from a single team or tool.</p>
            <div className="findings-grid">
              {findings.map((f) => (
                <div key={f.id} className={`finding-card finding-card--${f.type}`}>
                  <h3 className="finding-card-title">{f.title}</h3>
                  <p className="finding-card-desc">{f.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {stats && (
          <section className="charts-section" aria-label="Data visualizations">
            <h2 className="charts-title">Data visualizations</h2>
            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-card-title">Activity by type</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.byType).map(([name, value]) => ({
                        name: name.replace('_', ' '),
                        value,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.keys(stats.byType).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, 'Activities']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3 className="chart-card-title">Activities over the last 14 days</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stats.byDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      labelFormatter={(d) => new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      formatter={(value: number) => [value, 'Activities']}
                    />
                    <Bar dataKey="count" fill="#5b6bc0" radius={[4, 4, 0, 0]} name="Activities" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        <div className="filters">
          <input
            type="search"
            placeholder="Search activities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All types</option>
            {activityTypes.map((t) => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="insights-list">
          {insights.length === 0 ? (
            <p className="empty">No activities match your filters.</p>
          ) : (
            insights.map((item) => (
              <article
                key={item.activity.id}
                className="insight-card insight-card-clickable"
                onClick={() => setSelected(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(item)}
              >
                <div className="card-meta">
                  <span className="type">{item.activity.type}</span>
                  <span className="source">{item.activity.source}</span>
                  <time dateTime={item.activity.timestamp}>
                    {new Date(item.activity.timestamp).toLocaleDateString()}
                  </time>
                </div>
                {item.activity.title && (
                  <h3 className="card-title">{item.activity.title}</h3>
                )}
                {item.activity.body && (
                  <p className="card-body">{item.activity.body}</p>
                )}
                {item.relatedEntities.length > 0 && (
                  <div className="related">
                    {item.relatedEntities.map((e) => (
                      <span key={e.id} className="entity-tag" title={e.type}>
                        {e.name}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {selected && (
        <ActivityDetailModal
          activityId={selected.activity.id}
          initialActivity={selected.activity}
          relatedEntities={selected.relatedEntities}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
