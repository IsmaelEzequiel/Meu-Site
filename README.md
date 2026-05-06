# ismael.dev

Personal site — terminal-flavored React app + Express/Prisma backend.

```
.
├── src/                 # Vite + React frontend
├── public/              # static assets (favicons, posts, resume.md, pdf)
├── server/              # Express + Prisma API (guestbook, image uploads)
├── index.html
├── vite.config.js       # proxies /api and /uploads → http://localhost:4000
└── package.json
```

## Quick start

### 1. Install

```bash
npm install
npm --prefix server install
```

### 2. Database

The backend needs Postgres. Spin one up however you like — Docker is fastest:

```bash
docker run --name ismael-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ismael_dev -p 5432:5432 -d postgres:16
```

Then configure the server:

```bash
cp server/.env.example server/.env
# edit server/.env if your DATABASE_URL differs
npm --prefix server run prisma:migrate -- --name init
```

### 3. Run both processes

```bash
npm run dev:all
```

That runs Vite (port **3000**) and the API (port **4000**) together. Or run them separately:

```bash
npm run dev          # frontend only
npm run dev:server   # backend only
```

Open <http://localhost:3000>.

## Routes

- `/` home
- `/about` about
- `/blog` post list — markdown files in `public/posts/`
- `/blog/:slug` rendered post
- `/contact` contact info
- `/resume` rendered resume
- `/guestbook` guestbook (reads/writes via `/api/guestbook`)
- `/admin` upload manager (login with `ADMIN_PASSWORD` from `server/.env`)

## API

| Method | Path                | Notes                                          |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/api/health`       | health probe                                   |
| GET    | `/api/guestbook`    | list entries (newest first)                    |
| POST   | `/api/guestbook`    | `{ nick, message }` — nick ≤24, message ≤280   |
| POST   | `/api/admin/login`  | `{ password }` → `{ token }`                   |
| GET    | `/api/admin/me`     | verify token (admin)                           |
| GET    | `/api/uploads`      | list uploaded files (admin)                    |
| POST   | `/api/uploads`      | multipart `file=<image>` (admin)               |
| DELETE | `/api/uploads/:id`  | delete upload (admin)                          |
| GET    | `/uploads/:name`    | public static file, served by Express          |

## Keyboard shortcuts

- `⌘K` / `Ctrl+K` — command palette
- `g h/a/b/c/r/g` — jump to home / about / blog / contact / resume / guestbook (vim-style leader)
- `t` — toggle theme

## Build

```bash
npm run build      # frontend → dist/
npm --prefix server start   # production server
```

The site is intentionally simple: hash routing, no SSR, markdown rendered client-side.
