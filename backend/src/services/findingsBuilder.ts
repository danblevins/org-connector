import { store } from '../store';

export interface Finding {
  id: string;
  type: 'cross_team' | 'hot_topic' | 'connector' | 'launch_alignment' | 'bottleneck' | 'insight';
  title: string;
  description: string;
}

/**
 * Compute org-wide findings from the unified store — connections and patterns
 * a user wouldn't easily see by scanning individual activities.
 */
export function buildFindings(): Finding[] {
  const findings: Finding[] = [];
  const entities = store.getEntities();
  const activities = store.getActivities();
  const entityMap = new Map(entities.map((e) => [e.id, e]));
  const teamIds = new Set(entities.filter((e) => e.type === 'team').map((e) => e.id));
  const projectIds = new Set(entities.filter((e) => e.type === 'project').map((e) => e.id));
  const topicIds = new Set(entities.filter((e) => e.type === 'topic').map((e) => e.id));
  const personIds = new Set(entities.filter((e) => e.type === 'person').map((e) => e.id));

  // Project → set of teams that appear in activities linked to that project
  const projectTeams = new Map<string, Set<string>>();
  // Topic → count of activities
  const topicCount = new Map<string, number>();
  // Person → set of teams they appear with (via activities)
  const personTeams = new Map<string, Set<string>>();
  // Activity bodies for keyword scan
  const launchKeywords = ['launch', 'go-live', 'freeze', 'deploy', 'staging', 'runbook'];
  const bottleneckKeywords = ['blocking', 'blocked', 'failed', 'rollback', 'fix', 'critical'];

  for (const a of activities) {
    const linkedTeams = new Set(a.linkedEntityIds.filter((id) => teamIds.has(id)));
    const linkedProjects = a.linkedEntityIds.filter((id) => projectIds.has(id));
    const linkedTopics = a.linkedEntityIds.filter((id) => topicIds.has(id));
    const author = a.author && personIds.has(a.author) ? a.author : null;

    for (const pid of linkedProjects) {
      if (!projectTeams.has(pid)) projectTeams.set(pid, new Set());
      linkedTeams.forEach((t) => projectTeams.get(pid)!.add(t));
    }
    for (const tid of linkedTopics) {
      topicCount.set(tid, (topicCount.get(tid) ?? 0) + 1);
    }
    if (author) {
      if (!personTeams.has(author)) personTeams.set(author, new Set());
      linkedTeams.forEach((t) => personTeams.get(author)!.add(t));
    }
  }

  // Cross-team projects: projects with 2+ teams in their activity set
  for (const [projectId, teams] of projectTeams) {
    const teamOnly = new Set([...teams].filter((id) => teamIds.has(id)));
    if (teamOnly.size >= 2) {
      const project = entityMap.get(projectId);
      const teamNames = [...teamOnly].map((id) => entityMap.get(id)?.name ?? id).join(', ');
      const count = activities.filter(
        (a) => a.linkedEntityIds.includes(projectId) || a.author
      ).length;
      findings.push({
        id: `cross-${projectId}`,
        type: 'cross_team',
        title: `${project?.name ?? projectId} spans ${teamOnly.size} teams`,
        description: `Engineering, Product, and Design are all active on this project. ${teamNames} have ${count} activities linked to it — a strong cross-team signal.`,
      });
    }
  }

  // Hot topics: topics with most activity
  const sortedTopics = [...topicCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (sortedTopics.length > 0) {
    const top = sortedTopics[0];
    const topic = entityMap.get(top[0]);
    const rest = sortedTopics.slice(1).map(([id, n]) => `${entityMap.get(id)?.name ?? id} (${n})`).join(', ');
    findings.push({
      id: 'hot-topic',
      type: 'hot_topic',
      title: `"${topic?.name ?? top[0]}" is the most discussed topic`,
      description: rest
        ? `${top[1]} activities reference it across messages, tasks, and meetings. ${rest} also show up frequently.`
        : `${top[1]} activities reference it across messages, tasks, and meetings.`,
    });
  }

  // Key connectors: people who show up with 2+ teams
  const connectors = [...personTeams.entries()]
    .filter(([, teams]) => {
      const teamOnly = [...teams].filter((id) => teamIds.has(id));
      return teamOnly.length >= 2;
    })
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 2);
  if (connectors.length > 0) {
    const names = connectors.map(([id]) => entityMap.get(id)?.name ?? id).join(' and ');
    findings.push({
      id: 'connectors',
      type: 'connector',
      title: 'Key connectors across the org',
      description: `${names} appear in activities that span multiple teams. They’re natural points of contact for cross-team coordination.`,
    });
  }

  // Launch alignment: activities mentioning launch/freeze/deploy
  const launchActivities = activities.filter((a) => {
    const text = `${a.title ?? ''} ${a.body ?? ''}`.toLowerCase();
    return launchKeywords.some((k) => text.includes(k));
  });
  if (launchActivities.length >= 3) {
    const teamCount = new Set(launchActivities.flatMap((a) => a.linkedEntityIds.filter((id) => teamIds.has(id)))).size;
    findings.push({
      id: 'launch-alignment',
      type: 'launch_alignment',
      title: 'Launch and timeline alignment in motion',
      description: `${launchActivities.length} activities mention launch, freeze, or deploy. ${teamCount} teams are involved — good signal that go-live is coordinated across the org.`,
    });
  }

  // Bottleneck / blocker signal
  const bottleneckActivities = activities.filter((a) => {
    const text = `${a.title ?? ''} ${a.body ?? ''}`.toLowerCase();
    return bottleneckKeywords.some((k) => text.includes(k));
  });
  if (bottleneckActivities.length >= 2) {
    findings.push({
      id: 'bottleneck',
      type: 'bottleneck',
      title: 'Potential bottleneck or blocker',
      description: `${bottleneckActivities.length} activities reference failures, rollbacks, or blocking work. Worth scanning these to unblock dependent teams.`,
    });
  }

  // General insight: total cross-entity density
  const multiEntityActivities = activities.filter((a) => a.linkedEntityIds.length >= 2 || (a.author && a.linkedEntityIds.length >= 1));
  if (multiEntityActivities.length > 10) {
    findings.push({
      id: 'density',
      type: 'insight',
      title: 'High cross-entity activity',
      description: `${multiEntityActivities.length} activities link multiple teams, projects, or topics. The org is well connected — use the Network view to explore these links.`,
    });
  }

  return findings.slice(0, 6);
}
