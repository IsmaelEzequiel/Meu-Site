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

## Deploy with Docker

Two Dockerfiles + a `docker-compose.yml` bring up Postgres, the API, and the
nginx-served frontend together.

```bash
cp .env.example .env             # set ADMIN_PASSWORD at minimum
docker compose up -d --build
docker compose exec server npx prisma migrate deploy   # one-time
```

Open <http://localhost:8080> (override with `HTTP_PORT`).

Image layout:

- **`./Dockerfile`** — frontend. Stage 1: `node:22-alpine` runs `vite build`.
  Stage 2: `nginx:1.27-alpine` serves `dist/` and proxies `/api` + `/uploads`
  to the `server` container. `nginx.conf` lives next to the Dockerfile.
- **`./server/Dockerfile`** — backend. Three stages on `node:22-alpine`:
  install all deps, generate the Prisma client, then a slim runtime stage
  that copies only `--omit=dev` deps + the generated client + app source.
  Runs as `node` user under `tini`.

Uploaded images persist in the `uploads` named volume; the database in
`db_data`. Both survive `docker compose down`; remove with
`docker compose down -v`.

Building images individually (no compose):

```bash
docker build -t ismael-web .                                  # frontend
docker build -t ismael-server ./server                        # backend
docker build -t ismael-web --build-arg VITE_API_URL=https://api.example.com .  # split-domain
```

## Deploy on Railway (split services)

When the frontend and backend live on different Railway services, the
frontend bundle has to know the backend's URL at *build time*, and the
backend has to allow the frontend's origin.

**Backend service** (root: `server/`)

| Variable          | Value                                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`    | injected by Railway's Postgres add-on                                     |
| `ADMIN_PASSWORD`  | `openssl rand -hex 24`                                                    |
| `CORS_ORIGIN`     | `https://your-frontend.up.railway.app`                                    |
| `PORT`            | injected by Railway (server already binds to `process.env.PORT`)          |
| `MAX_UPLOAD_MB`   | `8` (optional)                                                            |

After the first deploy, run the migration once:

```bash
railway run --service server -- npx prisma migrate deploy
```

**Frontend service** (root: `.`)

Set this Build-time variable in Railway (it's a Docker build arg, not a
runtime env):

```
VITE_API_URL=https://server-production-9e07.up.railway.app
```

Then trigger a redeploy so the Docker build picks it up. The bundle will
call the backend at that absolute URL; the nginx proxy in `nginx.conf`
becomes inert in this mode (it only kicks in when `VITE_API_URL` is empty
and frontend + backend share a host).

> **Persisting uploads on Railway**: by default container filesystems are
> ephemeral. Attach a Railway Volume to the server service mounted at
> `/app/uploads`, otherwise uploaded images disappear on redeploy.

The site is intentionally simple: hash routing, no SSR, markdown rendered client-side.
