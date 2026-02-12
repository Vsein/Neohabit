# Build Stage
FROM node:25.3-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final image - just static files with injected runtime-config
FROM busybox:latest

WORKDIR /srv
COPY --from=build /app/dist /app-dist

COPY --chmod=755 docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["sleep", "infinity"]
