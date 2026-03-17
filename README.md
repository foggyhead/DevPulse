# DevPulse — GitHub Activity Analytics Dashboard

> Decode the developer. Discover the story.

DevPulse is a full-stack analytics dashboard that transforms raw GitHub data into meaningful developer insights — commit rhythms, language DNA, PR velocity, and technical debt signals — presented in a minimal, high-end interface.

![DevPulse Landing](https://i.imgur.com/placeholder.png)

---

## What it does

Enter any GitHub username and DevPulse runs a concurrent data pipeline across the GitHub REST API, aggregating and transforming activity into five key analytics views:

| Feature | Description |
|---|---|
| **Commit Activity Heatmap** | 52-week contribution grid aggregated across top repositories, with current and longest streak tracking |
| **Developer's Rhythm** | Hour-of-day commit histogram built from push events + commit search API — reveals peak productivity windows |
| **Language DNA** | Byte-level language aggregation across all non-forked repos, visualised as a donut chart |
| **PR Velocity** | Pull request turnaround timeline with area chart, showing merge/open/closed distribution |
| **Technical Debt Insights** | Algorithmic pipeline health score (0–100) based on average PR turnaround time — classifies development pace as Fast Iteration, Moderate, Elevated Debt, or High Risk |

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) — React server/client components
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **Framer Motion** — Fluid animations and page transitions
- **Recharts** — Data visualisation (area charts, bar charts, donut charts)
- **Lucide React** — Icon system

### Backend
- **FastAPI** — Async Python API with automatic OpenAPI docs
- **httpx** — Async HTTP client for GitHub API calls
- **asyncio.gather** — Concurrent pipeline: all 5 data sources fetched in parallel
- **Tenacity** — Automatic retry logic with exponential backoff
- **Pydantic v2** — Request/response validation and settings management

### Infrastructure
- **PostgreSQL** — Database (provisioned, ready for caching layer)
- **Docker Compose** — Local development orchestration

---

## Architecture

```
DevPulse/
├── frontend/                  # Next.js App Router
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   └── dashboard/[username]/page.tsx   # Analytics dashboard
│   ├── components/
│   │   ├── bento/             # Dashboard tiles (Profile, Heatmap, Languages…)
│   │   └── ui/                # Shared UI (LoadingAnimation, GhostGrid)
│   └── lib/api.ts             # API client
│
└── backend/                   # FastAPI
    └── app/
        ├── main.py            # App entry point + CORS
        ├── config.py          # Pydantic settings
        ├── routers/github.py  # API endpoints
        ├── schemas/github.py  # Response models
        └── services/
            └── github_service.py   # Data pipeline
```

### Data Pipeline

```
GET /api/v1/github/analytics/{username}
        │
        ├── asyncio.gather()  ← all 5 calls run concurrently
        │       ├── get_profile()          → GitHub /users/{username}
        │       ├── get_languages()        → /repos + /languages (per repo)
        │       ├── get_commit_activity()  → /stats/commit_activity (top 5 repos, aggregated)
        │       ├── get_pr_velocity()      → /search/issues?type=pr
        │       └── get_dev_rhythm()       → /events/public + /search/commits
        │
        └── AnalyticsSummary (Pydantic) → JSON → Frontend
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- Python 3.12+
- A GitHub Personal Access Token (no scopes needed — public data only)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Add your GitHub token to .env: GITHUB_TOKEN=ghp_...
pip install -r requirements.txt
uvicorn app.main:app --reload
# API running at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

### 4. Or run everything with Docker

```bash
docker-compose up
```

---

## API Reference

| Endpoint | Description |
|---|---|
| `GET /health` | Service health check |
| `GET /api/v1/github/user/{username}` | GitHub user profile |
| `GET /api/v1/github/analytics/{username}` | Full analytics pipeline |

Full interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

## Design System

- **Background:** Deep Charcoal `#121212`
- **Accent:** Soft Lavender `#E6E6FA` / `#9d8fcd`
- **Style:** Glassmorphism cards, Bento Grid layout, Framer Motion transitions
- **Aesthetic:** 2026 Tech-Minimalist — Linear meets Apple

---

## Environment Variables

### Backend (`backend/.env`)
```
GITHUB_TOKEN=ghp_your_token_here      # Required — raises rate limit to 5000 req/hr
DATABASE_URL=postgresql+asyncpg://... # PostgreSQL connection
CORS_ORIGINS=["http://localhost:3000"] # Update for production
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Roadmap

- [ ] PostgreSQL caching layer — store results to reduce API calls
- [ ] Repository activity timeline visualisation
- [ ] Comparative analysis (two developers side-by-side)
- [ ] Export dashboard as PDF / shareable link

---

## Author

Built by **Harsha** — [GitHub](https://github.com/your-username)

---

*DevPulse © 2026*
