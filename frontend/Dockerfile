# Build Stage
FROM node:25.3-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final image - just static files
FROM alpine # ideally scratch
RUN apk add --no-cache gettext

WORKDIR /srv
COPY --from=build /app/dist /srv/

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["sleep", "infinity"]
