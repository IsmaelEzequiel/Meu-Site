import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const PORT = Number(process.env.PORT || 4000);
const MAX_MB = Number(process.env.MAX_UPLOAD_MB || 8);
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

if (!ADMIN_PASSWORD) {
  console.warn('⚠ ADMIN_PASSWORD is not set — /admin will be inaccessible.');
}

const prisma = new PrismaClient();
const app = express();

if (CORS_ORIGIN.length) app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '64kb' }));

// --- static uploads (public) ---
app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '7d',
  index: false,
  fallthrough: true,
}));

// --- health ---
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// --- admin auth ---
const safeEqual = (a, b) => {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
};

const requireAdmin = (req, res, next) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'admin disabled (no ADMIN_PASSWORD)' });
  const auth = req.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'missing bearer token' });
  if (!safeEqual(m[1], ADMIN_PASSWORD)) return res.status(401).json({ error: 'invalid token' });
  next();
};

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'admin disabled (no ADMIN_PASSWORD)' });
  const password = String(req.body?.password ?? '');
  if (!password) return res.status(400).json({ error: 'password required' });
  if (!safeEqual(password, ADMIN_PASSWORD)) return res.status(401).json({ error: 'invalid password' });
  res.json({ token: ADMIN_PASSWORD });
});

app.get('/api/admin/me', requireAdmin, (_req, res) => res.json({ ok: true }));

// --- guestbook (public) ---
const toEntry = (e) => ({
  id: e.id,
  nick: e.nick,
  message: e.message,
  created_at: e.createdAt.toISOString(),
});

app.get('/api/guestbook', async (_req, res, next) => {
  try {
    const rows = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(rows.map(toEntry));
  } catch (e) { next(e); }
});

app.post('/api/guestbook', async (req, res, next) => {
  try {
    const nick = String(req.body?.nick ?? '').trim();
    const message = String(req.body?.message ?? '').trim();
    if (!nick) return res.status(400).json({ error: 'nick is required' });
    if (!message) return res.status(400).json({ error: 'message is required' });
    if (nick.length > 24) return res.status(400).json({ error: 'nick max 24 characters' });
    if (message.length > 280) return res.status(400).json({ error: 'message max 280 characters' });

    const created = await prisma.guestbookEntry.create({
      data: { nick, message },
    });
    res.status(201).json(toEntry(created));
  } catch (e) { next(e); }
});

// --- uploads ---
const ALLOWED_MIME = new Set([
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
]);

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const id = randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) return cb(new Error('unsupported file type'));
    cb(null, true);
  },
});

const toUpload = (r) => ({
  id: r.id,
  filename: r.filename,
  originalName: r.originalName,
  mimeType: r.mimeType,
  size: r.size,
  url: `/uploads/${r.filename}`,
  created_at: r.createdAt.toISOString(),
});

app.get('/api/uploads', requireAdmin, async (_req, res, next) => {
  try {
    const rows = await prisma.upload.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    res.json(rows.map(toUpload));
  } catch (e) { next(e); }
});

app.post('/api/uploads', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' });
    const row = await prisma.upload.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
    res.status(201).json(toUpload(row));
  } catch (e) { next(e); }
});

app.delete('/api/uploads/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'invalid id' });

    const row = await prisma.upload.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ error: 'not found' });

    // Constrain to UPLOAD_DIR to prevent any path traversal via filename.
    const filePath = path.resolve(UPLOAD_DIR, row.filename);
    if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
      return res.status(400).json({ error: 'invalid path' });
    }
    await fs.promises.unlink(filePath).catch(err => {
      if (err.code !== 'ENOENT') throw err;
    });
    await prisma.upload.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// --- error handler ---
app.use((err, _req, res, _next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `file too large (max ${MAX_MB}MB)` });
  }
  console.error(err);
  res.status(500).json({ error: err?.message || 'internal error' });
});

app.listen(PORT, () => {
  console.log(`api listening on http://localhost:${PORT}`);
});
