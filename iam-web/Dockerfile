# syntax=docker/dockerfile:1

########################################################################
# deps — install npm dependencies (cached across builds via BuildKit)
########################################################################
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

########################################################################
# dev — used by docker-compose.override.yml for local development with
# Vite HMR. Source is bind-mounted at runtime; node_modules from this
# image is preserved via an anonymous volume (see compose override).
########################################################################
FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

########################################################################
# build — production build (tsc -b && vite build)
########################################################################
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

########################################################################
# runtime — static build served by an unprivileged Nginx (non-root by
# design, listens on 8080), which also reverse-proxies /api to the
# backend so the browser only ever talks to a single origin.
########################################################################
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget --spider -q http://localhost:8080/ || exit 1
