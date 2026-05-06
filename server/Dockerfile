# syntax=docker/dockerfile:1.7

# === deps: install full deps (incl. prisma CLI) and generate the Prisma client ===
FROM node:22-alpine AS build
WORKDIR /app

# OpenSSL is required by the Prisma engine on Alpine (musl).
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

# === runtime: prod-only deps + generated client + app code ===
FROM node:22-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache openssl tini

ENV NODE_ENV=production
ENV PORT=4000

# Install only production deps for a slim runtime.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bring the generated Prisma client (with the engine binary) over from build.
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

# App code + schema (schema is needed at runtime for `prisma migrate deploy`
# if you choose to run it via the build image; see README).
COPY prisma ./prisma
COPY src ./src

# Persistent dirs. Mount a volume at /app/uploads in production.
RUN mkdir -p uploads && chown -R node:node /app

USER node
EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
