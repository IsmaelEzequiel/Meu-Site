# server

Express + Prisma API for the personal site. Backs the guestbook and serves uploaded images.

## Setup

```bash
cd server
cp .env.example .env   # edit DATABASE_URL to point at your local postgres
npm install
npm run prisma:migrate -- --name init
npm run dev
```

`npm run dev` uses `node --watch` for live reload.

## Endpoints

- `GET  /api/health` → `{ ok: true }`
- `GET  /api/guestbook` → list entries (newest first, max 200)
- `POST /api/guestbook` → `{ nick, message }` create entry
- `GET  /api/uploads` → list uploaded files
- `POST /api/uploads` → multipart `file=<image>` create upload, returns `{ url, ... }`
- `GET  /uploads/:filename` → static file (served by `express.static`)

In dev, Vite proxies `/api` and `/uploads` to this server (port 4000).

## Database

Prisma schema lives in `prisma/schema.prisma`. To make changes:

```bash
npx prisma migrate dev --name <change_name>
```

`prisma migrate dev` regenerates the client automatically.

## Uploads

Files are written to `./uploads/` and served at `/uploads/<filename>`. The directory is gitignored except for `.gitkeep`. Allowed types: png, jpeg, webp, gif, avif, svg. Default max size: 8MB (override via `MAX_UPLOAD_MB`).
