# Expense Tracker

A simple **full-stack** expense tracker. Add expenses, categorize them, filter,
and see a live spending breakdown. Built to show a clean separation between a
**React** frontend, an **Express** REST API, and a **SQLite** database.

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express REST API
- **Database:** SQLite via Node's built-in `node:sqlite` driver (no native build step)

## Features

- Add, list, filter, and delete expenses (full CRUD)
- Eight spending categories with icons and color-coded bars
- Live summary: total spent, average expense, top category
- Spending-by-category breakdown with share percentages
- Server-side validation and a persistent SQLite database (seeded on first run)

## Requirements

- **Node.js ≥ 22.5** (the backend uses the built-in `node:sqlite` module)

Check yours with `node -v`. If you're on an older version, install the latest
LTS from [nodejs.org](https://nodejs.org/).

## Quick start

From the project root:

```bash
# 1. install root, server, and client dependencies
npm run install:all

# 2. run the API (:4000) and the frontend (:5173) together
npm run dev
```

Then open **http://localhost:5173**. The Vite dev server proxies `/api` calls to
the Express server, so there's nothing else to configure.

### Running the two apps separately

```bash
# terminal 1 — API
cd server && npm install && npm run dev      # http://localhost:4000

# terminal 2 — frontend
cd client && npm install && npm run dev      # http://localhost:5173
```

## API reference

Base URL: `http://localhost:4000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/categories` | List of allowed categories |
| `GET` | `/expenses` | All expenses (optional `?category=Food`) |
| `GET` | `/summary` | Totals and per-category breakdown |
| `POST` | `/expenses` | Create an expense |
| `PUT` | `/expenses/:id` | Update an expense |
| `DELETE` | `/expenses/:id` | Delete an expense |

Expense shape:

```json
{
  "description": "Groceries",
  "amount": 54.20,
  "category": "Food",
  "date": "2026-08-13"
}
```

Example:

```bash
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"description":"Coffee","amount":4.5,"category":"Food","date":"2026-08-13"}'
```

## Project structure

```
expense-tracker/
├── server/                 # Express + SQLite REST API
│   ├── db.js               # database setup, schema, seed data
│   ├── index.js            # routes + validation
│   └── package.json
├── client/                 # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/     # form, list, summary, breakdown
│   │   ├── api.js          # fetch client
│   │   ├── categories.js   # category icons/colors + helpers
│   │   └── App.jsx
│   └── package.json
├── package.json            # root scripts (install:all, dev)
└── README.md
```

## Notes

- The SQLite file (`server/expenses.db`) is created automatically on first run
  and seeded with a few sample expenses. It's git-ignored.
- For a production frontend build, set `VITE_API_URL` to your deployed API's base
  URL (see `.env.example`) and run `npm run build` in `client/`.

## License

MIT © Arlind Idrizi
