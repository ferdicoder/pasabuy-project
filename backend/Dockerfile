
# ---- Stage 1: build TypeScript dist/ ----
FROM node:24-alpine AS build

WORKDIR /app

# Copy only manifests first so this layer caches until depen change.
COPY package.json package-lock.json ./

# Reproducible install from the lockfile (includes devDeps: typescript, @types/*).
RUN npm ci

# Copy sources + tsconfig and compile with `tsc` → /app/dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: production runtime ----
FROM node:24-alpine AS runtime

WORKDIR /app

# Same manifests, but drop devDependencies (typescript, tsx, @types/*).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Bring in the compiled JS from the build stage (not raw .ts, not node_modules from stage 1).
COPY --from=build /app/dist ./dist

# Do NOT copy .env — secrets are injected at runtime
# (docker run --env-file .env  or  -e VAR=...).
# dotenv/config still works if a .env file is mounted/added, but
# runtime env vars are the standard way in containers.

EXPOSE 5000

CMD ["npm", "start"]