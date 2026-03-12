import { useState, useEffect } from 'react';
import { api, type Activity, type Entity } from '../api/client';
import './ActivityDetailModal.css';

interface ActivityDetailModalProps {
  activityId: string;
  initialActivity?: Activity | null;
  relatedEntities?: Entity[];
  onClose: () => void;
}

export function ActivityDetailModal({
  activityId,
  initialActivity,
  relatedEntities = [],
  onClose,
}: ActivityDetailModalProps) {
  const [activity, setActivity] = useState<Activity | null>(initialActivity ?? null);
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(!initialActivity);
  const [entityNames, setEntityNames] = useState<Record<string, string>>({});

  const loadActivity = (id: string) => {
    setLoading(true);
    setActivity(null);
    setRelatedActivities([]);
    api.getActivity(id)
      .then((a) => {
        setActivity(a);
        return api.getRelatedActivities(id, 8);
      })
      .then(setRelatedActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialActivity?.id === activityId) {
      setActivity(initialActivity);
      setLoading(false);
      api.getRelatedActivities(activityId, 8).then(setRelatedActivities).catch(console.error);
      return;
    }
    loadActivity(activityId);
  }, [activityId, initialActivity?.id]);

  useEffect(() => {
    const ids = new Set<string>();
    activity?.linkedEntityIds.forEach((id) => ids.add(id));
    if (activity?.author) ids.add(activity.author);
    relatedEntities.forEach((e) => ids.add(e.id));
    if (ids.size === 0) return;
    api.getEntities()
      .then((entities) => {
        const map: Record<string, string> = {};
        entities.forEach((e) => { map[e.id] = e.name; });
        setEntityNames(map);
      })
      .catch(console.error);
  }, [activity?.linkedEntityIds, activity?.author, relatedEntities]);

  const handleRelatedClick = (id: string) => {
    loadActivity(id);
  };

  if (loading && !activity) {
    return (
      <div className="activity-modal-overlay" onClick={onClose}>
        <div className="activity-modal" onClick={(e) => e.stopPropagation()}>
          <div className="activity-modal-loading">Loading…</div>
        </div>
      </div>
    );
  }

  if (!activity) return null;

  const authorName = activity.author ? (entityNames[activity.author] ?? activity.author) : null;

  return (
    <div className="activity-modal-overlay" onClick={onClose}>
      <div className="activity-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="activity-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="activity-modal-header">
          <span className="activity-modal-type">{activity.type.replace('_', ' ')}</span>
          <span className="activity-modal-source">{activity.source}</span>
          <time>{new Date(activity.timestamp).toLocaleString()}</time>
        </div>
        {activity.title && <h2 className="activity-modal-title">{activity.title}</h2>}
        {authorName && <p className="activity-modal-author">By {authorName}</p>}
        {activity.body && (
          <div className="activity-modal-body">{activity.body}</div>
        )}
        {(relatedEntities.length > 0 || activity.linkedEntityIds.length > 0) && (
          <div className="activity-modal-entities">
            <h3>Related to</h3>
            <div className="activity-modal-entity-tags">
              {(relatedEntities.length ? relatedEntities : activity.linkedEntityIds.map((id) => ({ id, name: entityNames[id] ?? id }))).map((e) => (
                <span key={e.id} className="entity-tag">
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {relatedActivities.length > 0 && (
          <div className="activity-modal-related">
            <h3>Closely related activities</h3>
            <p className="activity-modal-related-hint">Click to view details</p>
            <ul className="activity-modal-related-list">
              {relatedActivities.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="activity-modal-related-item"
                    onClick={() => handleRelatedClick(a.id)}
                  >
                    <span className="act-type">{a.type.replace('_', ' ')}</span>
                    {a.title || (a.body && a.body.slice(0, 50) + (a.body.length > 50 ? '…' : ''))}
                    <time>{new Date(a.timestamp).toLocaleDateString()}</time>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
