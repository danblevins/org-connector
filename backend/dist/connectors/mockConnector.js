"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockConnector = void 0;
exports.mockEntities = mockEntities;
exports.mockActivities = mockActivities;
exports.mockRelationships = mockRelationships;
const registry_1 = require("./registry");
const SOURCE_ID = 'mock';
function ts(daysAgo, hour = 10) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 30, 0, 0);
    return d.toISOString();
}
function mockEntities() {
    const list = [];
    const teams = [
        { id: 'team-eng', name: 'Engineering' },
        { id: 'team-product', name: 'Product' },
        { id: 'team-design', name: 'Design' },
        { id: 'team-ops', name: 'Operations' },
    ];
    const people = [
        { id: 'person-alice', name: 'Alice Chen' },
        { id: 'person-bob', name: 'Bob Martinez' },
        { id: 'person-carol', name: 'Carol Kim' },
        { id: 'person-dave', name: 'Dave Foster' },
        { id: 'person-eve', name: 'Eve Park' },
        { id: 'person-frank', name: 'Frank Liu' },
        { id: 'person-grace', name: 'Grace Wong' },
        { id: 'person-henry', name: 'Henry Torres' },
    ];
    const projects = [
        { id: 'proj-alpha', name: 'Project Alpha' },
        { id: 'proj-beta', name: 'Project Beta' },
        { id: 'proj-gamma', name: 'Project Gamma' },
    ];
    const channels = [
        { id: 'ch-general', name: '#general' },
        { id: 'ch-eng', name: '#engineering' },
        { id: 'ch-product', name: '#product' },
        { id: 'ch-random', name: '#random' },
    ];
    const topics = [
        { id: 'topic-api', name: 'API Design' },
        { id: 'topic-ux', name: 'UX Review' },
        { id: 'topic-launch', name: 'Launch' },
        { id: 'topic-onboarding', name: 'Onboarding' },
        { id: 'topic-sprint', name: 'Sprint Planning' },
    ];
    for (const t of teams)
        list.push({ ...t, type: 'team', source: SOURCE_ID });
    for (const p of people)
        list.push({ ...p, type: 'person', source: SOURCE_ID });
    for (const p of projects)
        list.push({ ...p, type: 'project', source: SOURCE_ID });
    for (const c of channels)
        list.push({ ...c, type: 'channel', source: SOURCE_ID });
    for (const t of topics)
        list.push({ ...t, type: 'topic', source: SOURCE_ID });
    return list;
}
function mockActivities() {
    const activities = [];
    let id = 1;
    const link = (...args) => args;
    // --- Slack-style messages with exact text ---
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        title: 'Sprint planning tomorrow 10am',
        body: 'Reminder: sprint planning tomorrow 10am. Please have your capacity and top 3 priorities in the doc by EOD. We will also lock the Alpha scope for next week.',
        timestamp: ts(1, 9),
        author: 'person-alice',
        linkedEntityIds: link('ch-eng', 'team-eng', 'proj-alpha', 'topic-sprint'),
        metadata: { channel: '#engineering', threadTs: 'mock-ts-1' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        title: 'API contract review',
        body: 'Can we align on the new REST contract for the beta launch? I left comments in the Confluence doc. Main question: do we version the /v2/users endpoint or add query params?',
        timestamp: ts(2, 14),
        author: 'person-bob',
        linkedEntityIds: link('ch-eng', 'proj-beta', 'topic-api'),
        metadata: { channel: '#engineering' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        title: 'Design feedback in Figma',
        body: 'UX review session notes are in the shared drive. Key points: simplify the onboarding flow (steps 2 and 3 can merge), and we need one more state for the empty dashboard. Handoff to Eng by EOD Thursday.',
        timestamp: ts(3, 11),
        author: 'person-carol',
        linkedEntityIds: link('ch-general', 'team-design', 'topic-ux', 'proj-alpha', 'topic-onboarding'),
        metadata: { channel: '#general' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: "Launch checklist is ready in the runbook. Ops and Product to sync on go-live timing — we're thinking Tuesday 2pm PT to avoid EU peak. Please confirm by Friday.",
        timestamp: ts(0, 8),
        author: 'person-dave',
        linkedEntityIds: link('ch-general', 'team-ops', 'team-product', 'topic-launch'),
        metadata: { channel: '#general' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        title: 'Beta release target',
        body: "We are targeting end of week for beta. Engineering and Product are aligned. Remaining: finish API docs and run one more security pass. I'll update the status page.",
        timestamp: ts(1, 16),
        author: 'person-eve',
        linkedEntityIds: link('ch-product', 'proj-beta', 'team-eng', 'team-product'),
        metadata: { channel: '#product' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: 'Heads up: the staging deploy failed on the new auth middleware. Rolling back for now. Alice and I will pair on it tomorrow morning.',
        timestamp: ts(0, 17),
        author: 'person-frank',
        linkedEntityIds: link('ch-eng', 'team-eng', 'proj-alpha'),
        metadata: { channel: '#engineering' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        title: 'Figma link for onboarding',
        body: 'Here’s the latest: https://figma.example/onboarding-v3. Please comment by Wednesday. We’re especially looking for feedback on the progress indicator.',
        timestamp: ts(4, 10),
        author: 'person-grace',
        linkedEntityIds: link('ch-general', 'team-design', 'topic-ux', 'topic-onboarding'),
        metadata: { channel: '#general' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: 'Q1 roadmap is finalized. Alpha launch, Beta API freeze, and Gamma discovery phase are all on track. I’ll share the summary doc in #product.',
        timestamp: ts(5, 9),
        author: 'person-henry',
        linkedEntityIds: link('ch-product', 'team-product', 'proj-alpha', 'proj-beta', 'proj-gamma'),
        metadata: { channel: '#product' },
    });
    // --- Meeting notes with full subject and detailed notes ---
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'meeting_note',
        title: 'Weekly sync — Engineering & Product',
        body: 'Subject: Engineering & Product weekly sync\nAttendees: Alice, Bob, Eve, Henry\n\nDecisions:\n- Alpha launch moved to next week (staging issue).\n- Beta API freeze this Friday; Bob to send final spec.\n- Gamma discovery: kickoff next Monday.\n\nAction items:\n- Alice: fix auth middleware and redeploy staging.\n- Eve: update status page and notify customers of beta date.',
        timestamp: ts(2, 10),
        author: 'person-alice',
        linkedEntityIds: link('team-eng', 'team-product', 'proj-alpha', 'proj-beta', 'proj-gamma'),
        metadata: { meetingSubject: 'Engineering & Product weekly sync', durationMinutes: 45 },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'meeting_note',
        title: 'Design review — Onboarding flow',
        body: 'Subject: Design review — Onboarding flow v3\nAttendees: Carol, Grace, Alice, Bob\n\nSummary:\n- Approved new onboarding flow. Steps 2 and 3 merged into a single “Preferences” step.\n- Empty dashboard state: add illustration and CTA to “Create your first project.”\n- Handoff to Engineering by EOD Thursday. Figma link in #general.\n\nFollow-up: Carol to schedule QA sync with Eng for next week.',
        timestamp: ts(4, 14),
        author: 'person-grace',
        linkedEntityIds: link('team-design', 'team-eng', 'proj-alpha', 'topic-ux', 'topic-onboarding'),
        metadata: { meetingSubject: 'Design review — Onboarding flow v3', durationMinutes: 60 },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'meeting_note',
        title: 'Launch readiness — Go/No-Go',
        body: 'Subject: Launch readiness — Go/No-Go for Alpha\nAttendees: Dave, Eve, Alice, Henry\n\nChecklist:\n- Staging: pass (after rollback). Redeploy by Tuesday.\n- Runbook: updated. Ops to do dry run Monday.\n- Comms: Product to send customer email Tuesday 9am.\n- Support: runbook and FAQ ready.\n\nDecision: Go for Tuesday 2pm PT launch. No-go criteria: staging down or P0 open.',
        timestamp: ts(1, 11),
        author: 'person-dave',
        linkedEntityIds: link('team-ops', 'team-product', 'team-eng', 'proj-alpha', 'topic-launch'),
        metadata: { meetingSubject: 'Launch readiness — Go/No-Go for Alpha', durationMinutes: 30 },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'meeting_note',
        title: 'API design deep dive',
        body: 'Subject: API design deep dive — Beta /v2 endpoints\nAttendees: Bob, Frank, Eve\n\nOutcomes:\n- Version in path: /v2/users. No query param versioning.\n- Pagination: cursor-based, max 100 per page.\n- Auth: Bearer token; scope docs to be updated.\n- Bob to publish OpenAPI spec by Wednesday.',
        timestamp: ts(3, 15),
        author: 'person-bob',
        linkedEntityIds: link('team-eng', 'team-product', 'proj-beta', 'topic-api'),
        metadata: { meetingSubject: 'API design deep dive — Beta /v2 endpoints', durationMinutes: 45 },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'summary',
        title: 'Q1 initiatives summary',
        body: 'Q1 Initiatives Summary\n\nAlpha: On track for launch next week. Staging fix in progress. Design handoff complete.\nBeta: API freeze Friday. Documentation and security pass in progress.\nGamma: Discovery phase; kickoff Monday. Cross-team dependencies identified (Eng, Product, Design).\n\nRisks: None. Blockers: staging deploy (owner: Alice).',
        timestamp: ts(7, 9),
        author: 'person-henry',
        linkedEntityIds: link('proj-alpha', 'proj-beta', 'proj-gamma', 'team-eng', 'team-product', 'team-design'),
        metadata: { docType: 'quarterly_summary' },
    });
    // --- Tasks with specific titles and descriptions ---
    const tasks = [
        { title: 'Fix auth middleware and redeploy staging', body: 'Staging deploy failed on new auth middleware (Bearer token validation in gateway). Roll back via pipeline rollback-job, fix in repo auth/gateway/middleware.ts, then redeploy. Coordinate with Frank on smoke tests (checklist in Confluence).', author: 'person-alice', links: ['team-eng', 'proj-alpha'], daysAgo: 1 },
        { title: 'Publish Beta API OpenAPI spec', body: 'Finalize OpenAPI 3.0 spec for /v2/users, /v2/workspaces, and /v2/audit. Include: pagination (cursor, max 100), auth scopes (read:users, write:users), and error response schemas. Publish to api-docs repo and link from status page.', author: 'person-bob', links: ['team-eng', 'proj-beta', 'topic-api'], daysAgo: 2 },
        { title: 'Merge onboarding steps 2 and 3 in Figma', body: 'In Figma file Onboarding-v3: combine "Profile" and "Preferences" into single "Preferences" step (frames 12–18). Update prototype flow and share link with Alice and Bob. Export specs for "Create your first project" CTA.', author: 'person-carol', links: ['team-design', 'proj-alpha', 'topic-onboarding'], daysAgo: 4 },
        { title: 'Update launch runbook and dry run', body: 'Add Tuesday 2pm PT launch sequence to runbook (sections 4.2–4.5): DNS cutover, feature flags, monitoring checks. Schedule dry run Monday 10am with Ops and Product; record in Zoom.', author: 'person-dave', links: ['team-ops', 'topic-launch'], daysAgo: 0 },
        { title: 'Send beta timeline update to customers', body: 'Draft status page post and customer email: "Beta available end of week; /v2 API docs live Thursday." Coordinate with Support on FAQ (ticket BETA-102). Use template in drive/marketing/beta-announce.', author: 'person-eve', links: ['team-product', 'proj-beta'], daysAgo: 1 },
        { title: 'Pair with Alice on auth middleware', body: 'Debug Bearer validation in auth/gateway/middleware.ts. Reproduce locally with staging token; fix and run integration tests (npm run test:integration). Verify staging after Alice redeploys.', author: 'person-frank', links: ['team-eng', 'proj-alpha'], daysAgo: 0 },
        { title: 'Handoff onboarding design to Engineering', body: 'Final handoff: Figma link figma.com/file/onboarding-v3, Zeplin specs for breakpoints 375/768/1024, and answers doc for Eng. Block 30min EOD Thursday for Q&A with Alice.', author: 'person-grace', links: ['team-design', 'team-eng', 'topic-ux', 'topic-onboarding'], daysAgo: 3 },
        { title: 'Finalize Q1 roadmap and share in #product', body: 'Publish "Q1 Roadmap Final" doc (drive/strategy/). Include: Alpha launch (next week), Beta API freeze (Fri), Gamma discovery kickoff (Mon). Post link in #product and tag @channel.', author: 'person-henry', links: ['team-product', 'proj-alpha', 'proj-beta', 'proj-gamma'], daysAgo: 5 },
        { title: 'Security pass on Beta API', body: 'Run OWASP-style review on /v2 endpoints: rate limits, input validation, auth scope enforcement. Log findings in security-review-beta.xlsx. Fix critical/high before Friday freeze; document medium for backlog.', author: 'person-bob', links: ['team-eng', 'proj-beta', 'topic-api'], daysAgo: 2 },
        { title: 'Create empty dashboard state assets', body: 'Deliverables: illustration (SVG, light/dark) for empty dashboard, CTA copy "Create your first project" (en/es), and specs for placement. Handoff in drive/design/empty-states. Due Wednesday EOD.', author: 'person-carol', links: ['team-design', 'proj-alpha', 'topic-ux'], daysAgo: 4 },
    ];
    for (const t of tasks) {
        activities.push({
            id: `mock-act-${id++}`,
            source: SOURCE_ID,
            type: 'task',
            title: t.title,
            body: t.body,
            timestamp: ts(t.daysAgo, 12),
            author: t.author,
            linkedEntityIds: t.links,
            metadata: { status: 'in_progress' },
        });
    }
    // --- More messages for density ---
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: 'Lunch and learn on API versioning tomorrow 12pm. Bob presenting. Join if you can.',
        timestamp: ts(1, 11),
        author: 'person-alice',
        linkedEntityIds: link('ch-eng', 'team-eng', 'topic-api'),
        metadata: { channel: '#engineering' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: 'Reminder: design system office hours Thursday 3pm. New onboarding components will be in the library.',
        timestamp: ts(2, 9),
        author: 'person-grace',
        linkedEntityIds: link('ch-general', 'team-design', 'topic-ux', 'topic-onboarding'),
        metadata: { channel: '#general' },
    });
    activities.push({
        id: `mock-act-${id++}`,
        source: SOURCE_ID,
        type: 'message',
        body: 'Gamma discovery kickoff is Monday 10am. Calendar invite sent. Please review the pre-read.',
        timestamp: ts(4, 14),
        author: 'person-henry',
        linkedEntityIds: link('ch-product', 'team-product', 'proj-gamma'),
        metadata: { channel: '#product' },
    });
    return activities;
}
function mockRelationships() {
    const rels = [];
    let id = 1;
    const pairs = [
        ['person-alice', 'team-eng', 'member_of'],
        ['person-bob', 'team-eng', 'member_of'],
        ['person-carol', 'team-design', 'member_of'],
        ['person-dave', 'team-ops', 'member_of'],
        ['person-eve', 'team-product', 'member_of'],
        ['person-frank', 'team-eng', 'member_of'],
        ['person-grace', 'team-design', 'member_of'],
        ['person-henry', 'team-product', 'member_of'],
        ['team-eng', 'proj-alpha', 'owns'],
        ['team-product', 'proj-alpha', 'owns'],
        ['team-eng', 'proj-beta', 'owns'],
        ['team-design', 'proj-alpha', 'owns'],
        ['ch-eng', 'team-eng', 'belongs_to'],
        ['ch-product', 'team-product', 'belongs_to'],
        ['ch-general', 'team-eng', 'belongs_to'],
    ];
    for (const [s, t, type] of pairs) {
        rels.push({
            id: `rel-${id++}`,
            sourceEntityId: s,
            targetEntityId: t,
            type,
        });
    }
    return rels;
}
const mockConnector = {
    getSourceId: () => SOURCE_ID,
    async sync() {
        return {
            entities: mockEntities(),
            activities: mockActivities(),
            relationships: mockRelationships(),
        };
    },
};
exports.mockConnector = mockConnector;
(0, registry_1.registerConnector)(mockConnector);
