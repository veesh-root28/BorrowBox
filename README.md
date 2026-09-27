# BorrowBox — Campus Item Lending Platform

BorrowBox is a simple web app that lets students on campus list items
they're willing to lend (books, calculators, chargers, tools, etc.)
and browse/request items other students have listed.

## Live app
(link added after deployment)

## Tech stack
- Node.js + Express
- EJS templates (server-rendered HTML)
- In-memory data store (resets on server restart — fine for a class demo)

## Running locally
```
npm install
npm start
```
Visit http://localhost:3000

## Running tests
```
npm test
```

## Routes
- `GET /` — home page, lists all items
- `GET /items/new` — form to add a new item
- `POST /items` — creates a new item
- `GET /items/:id` — view a single item's details
- `POST /items/:id/request` — request to borrow an item
- `GET /health` — health check endpoint (used by deployment platform)

## CI/CD
GitHub Actions runs on every push to `main`: installs dependencies and
runs the test suite. See `.github/workflows/ci.yml`.
