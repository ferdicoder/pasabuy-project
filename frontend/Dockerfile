# ---- Stage 1: build (Vite) ----
FROM node:24-alpine AS build

WORKDIR /app

# Cache-friendly: manifests first, deps only reinstalled when they change.
COPY package.json package-lock.json ./
RUN npm ci

# Vite bakes VITE_* vars into the bundle at build time — pass via --build-arg.
ARG VITE_API_URL
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_API_URL=$VITE_API_URL \
    VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

# Do NOT copy .env — secrets are passed as build args / injected at build.
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: runtime (static files only) ----
FROM nginx:alpine AS runtime

# SPA fallback for react-router deep links.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
