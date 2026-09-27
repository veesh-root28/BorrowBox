# BorrowBox — Campus Item Lending Platform

BorrowBox is a simple web app that lets students on campus list items
they're willing to lend (books, calculators, chargers, tools, etc.)
and browse/request items other students have listed. The app is
containerised with Docker and shipped through an automated
Git → CI → CD pipeline on GitHub Actions.

## Live app

- **EC2 (primary / Docker deployment):** http://13.235.82.7:3000
- **Render (secondary):** https://borrowbox-d1fi.onrender.com/

## Tech stack

- Node.js + Express
- EJS templates (server-rendered HTML)
- In-memory data store (resets on server restart — fine for a class demo)
- Docker (multi-stage-friendly single-stage image, `node:20-alpine`)
- GitHub Actions (CI + CD)
- Deployment target: AWS EC2 (Docker container), mirrored on Render

## Running locally (without Docker)

```bash
npm install
npm start
```

Visit http://localhost:3000

## Running with Docker

```bash
docker build -t borrowbox .
docker run -d --name borrowbox -p 3000:3000 borrowbox
```

Visit http://localhost:3000 — the container listens on port 3000
(see `EXPOSE 3000` in the Dockerfile) and reports health at `/health`.

## Running tests

```bash
npm test
```

Runs the Jest + Supertest suite (`jest --runInBand`).

## Routes

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Home page, lists all items |
| `/items/new` | GET | Form to add a new item |
| `/items` | POST | Creates a new item |
| `/items/:id` | GET | View a single item's details |
| `/items/:id/request` | POST | Request to borrow an item |
| `/health` | GET | Health check endpoint (used by the deploy pipeline and hosting platform) |

## Project structure

```
BorrowBox/
├── .github/workflows/   # ci.yml, deploy.yml
├── data/                # in-memory data module
├── public/              # static assets
├── tests/               # Jest + Supertest test suite
├── views/                # EJS templates
├── Dockerfile
├── .dockerignore
├── server.js
└── package.json
```

## CI/CD pipeline

Two GitHub Actions workflows run on every push to `main`:

**`ci.yml` — Continuous Integration** (push + pull request to `main`)
1. Checkout repository (`actions/checkout@v4`)
2. Set up Node.js 20 with npm caching (`actions/setup-node@v4`)
3. Install dependencies: `npm ci`
4. Run the test suite: `npm test`

**`deploy.yml` — Deploy BorrowBox to EC2** (push to `main` only)
1. Checkout repository and set up Node.js 20
2. Install dependencies and re-run `npm test` as a gate — the deploy
   step below only runs if this job (and its steps) succeed
3. SSH into the EC2 host (`appleboy/ssh-action@v1.2.0`, using the
   `EC2_HOST`, `EC2_USER`, and `EC2_SSH_KEY` GitHub Secrets) and:
   - `git pull origin main`
   - stop and remove the existing `borrowbox` container
   - `docker build -t borrowbox .`
   - `docker run -d --name borrowbox -p 3000:3000 borrowbox`
   - `curl -f http://localhost:3000/health` as a smoke test so the
     job fails (and the run is flagged red) if the new container
     doesn't come up healthy

No deployment credentials are stored in the repository — the EC2 host,
username, and SSH key are all GitHub Encrypted Secrets referenced only
by name in `deploy.yml`.

```
[ Local Dev ] --git push--> [ GitHub main ]
                                   |
                                   v
                    ┌──────────────────────────┐
                    │   GitHub Actions          │
                    │   Job: ci (test)          │
                    │   - npm ci                │
                    │   - npm test               │
                    └──────────────────────────┘
                                   |
                          tests pass?
                          /            \
                       YES              NO -> pipeline fails, nothing deployed
                        |
                        v
                    ┌──────────────────────────┐
                    │   Job: deploy (EC2)        │
                    │   - npm test (gate)        │
                    │   - ssh appleboy/ssh-action │
                    │   - docker build            │
                    │   - docker run (-p 3000)    │
                    │   - curl /health smoke test │
                    └──────────────────────────┘
                                   |
                                   v
                    Live at http://13.235.82.7:3000
```

See the workflow runs at
https://github.com/veesh-root28/BorrowBox/actions.

## About

No description, website, or topics provided.
