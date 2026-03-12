# Org Connector

Unified knowledge and network visualization for organizations. Connects scattered information from meetings, Slack, Asana, and other sources into a single view with searchable insights and an interactive network graph.

## Setup

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

API runs at `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000` and proxies `/api` to the backend.

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
| POST | `/api/sync` | Run all connectors and refresh data |

## Project layout

- `backend/` — Express + TypeScript: store, connector registry, mock connector, graph builder, routes.
- `frontend/` — React + Vite + TypeScript: Insights view, Network view (react-force-graph-2d), API client.
