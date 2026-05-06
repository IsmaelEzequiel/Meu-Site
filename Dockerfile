# syntax=docker/dockerfile:1.7

# === build stage: bundle the Vite app ===
FROM node:22-alpine AS build
WORKDIR /app

# When set, the bundle calls the API at this absolute URL instead of using
# relative paths. Required when frontend and backend live on different
# domains (e.g. Railway split services). Leave unset for the
# nginx-proxy-in-front-of-server compose deploy.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

# === runtime stage: serve static files via nginx ===
FROM nginx:1.27-alpine AS runtime

# Template-based config: the nginx image runs envsubst over files in
# /etc/nginx/templates/ at container start and writes results to
# /etc/nginx/conf.d/. We restrict substitution to $PORT so all the
# regular nginx variables ($host, $uri, $api_upstream, ...) are left
# alone.
ENV PORT=80
ENV NGINX_ENVSUBST_FILTER_VARS=PORT
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
