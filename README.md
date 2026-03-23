# Org Connector

**Problem Statement**: Organizations suffer from fragmented information sharing and knowledge silos, resulting in operational inefficiencies, redundant work, and lost collaborative potential. Valuable institutional knowledge remains trapped within disparate systems and workflows. We need a unified solution that synthesizes scattered organizational data into actionable insights, driving cross-functional knowledge sharing, accelerating collaboration, and empowering data-informed decision-making.

[LIVE PROOF OF CONCEPT ON SURGE](https://orgconnector.surge.sh/)

Unified knowledge and network visualization for organizations. Connects scattered information from meetings, Slack, Asana, and other sources into a single view with searchable insights and an interactive network graph.

## Setup

### Local development (two terminals)

**Backend**

```bash
cd backend
npm install
npm run build
npm start
```

API runs at `http://localhost:4000`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000` and proxies `/api` to the backend.

### Deploy on Netlify

The app is set up to run on Netlify: static frontend plus a serverless function that serves the API.

1. From the repo root: `npm install` (installs `serverless-http` for the function).
2. Connect the repo to Netlify. Use the built-in build: **Build command** `npm run build`, **Publish directory** `frontend/dist`, **Functions directory** `netlify/functions`.
3. Or rely on the root `netlify.toml`: it sets build, publish, and redirects `/api/*` to the function.

Local build from root (same as Netlify): `npm run build` (builds backend then frontend).

## Features

- **Insights**: Search and filter activities (messages, tasks, meeting notes) by keyword, source, and type. View related entities per activity.
- **Network**: Force-directed graph of entities (people, teams, projects, channels) and their connections. Click a node to see recent activity in a side panel.
- **Connectors**: Pluggable connector interface; MVP ships with a **mock** connector that seeds sample data. Add Slack, Asana, etc. by implementing the same interface and registering in the backend.
- **Sync**: `POST /api/sync` re-runs all connectors and refreshes the in-memory store.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/entities` | List entities (optional: `?type=&source=`) |
| GET | `/api/entities/:id` | Get one entity |
| GET | `/api/activities` | List activities (optional: `?source=&type=&entityId=&since=&until=`) |
| GET | `/api/activities/:id` | Get one activity |
| GET | `/api/insights` | Search insights (optional: `?q=&source=&type=&since=&limit=`) |
| GET | `/api/graph` | Graph nodes and edges for the network view |
| GET | `/api/findings` | Org-wide findings (cross-team, hot topics, etc.) |
| GET | `/api/stats` | Activity stats (by type, by day) for charts |
| POST | `/api/sync` | Run all connectors and refresh data |

## Project layout

- `backend/` — Express + TypeScript: store, connector registry, mock connector, graph builder, routes.
- `frontend/` — React + Vite + TypeScript: Insights view, Network view (react-force-graph-2d), API client.
- `netlify/functions/` — Serverless API handler (wraps Express app with serverless-http for Netlify).
