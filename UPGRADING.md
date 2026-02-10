# Guides to update to a newer version

## v1.0.0 → v1.1.0: deployment adjustments

I made all sorts of mistakes by leaving ports exposed in docker-compose, and
when some people tried closing them, they run into issues because I baked in
nginx.conf into the frontend and provided vars that had no deal being
customizable, thus increasing the confusion.

I made a huge overhaul, hardcoded internal ports, as they should've been
container-internal from the start, and removed needlessly exposed ports
entirely.

I removed the nginx out of the frontend image, thus decreasing its size from
~64MB to 6.7MB. Which isn't the smallest it could be, but that's already a
10-time decrease.

### Recommended actions:

Either backup your previous configs, fully copy a new `docker-compose.yaml` and
`.env.example` and make the changes you want, or simply refer to them. The
approximate steps are listed below.

Here's the recommended steps if you used the previous `docker-compose.yaml`:

0. If already using pre-built images - skip this step, otherwise:
  - If you were building images manually for web-hosting (as I wrote), then
    there's no longer any need for that. If you still prefer to be building
    things yourself, remove any changes made in the
    `/frontend/nginx.conf.template` and `git pull` the rest of the changes.
1. Remove unused vars from `.env`:
  - FRONTEND_HOST
2. Remove unused fields/environment vars from `docker-compose.yaml`:
  - postgres.ports
  - backend.ports
  - frontend.ports
  - backend.environment.BACKEND_PORT
  - frontend.environment.API_URL
  - frontend.environment.BACKEND_PORT
3. Change the backend.environment.FRONTEND_URL in `docker-compose.yaml` to:
```
      FRONTEND_URL: ${FRONTEND_URL:-http://127.0.0.1:${FRONTEND_PORT:-8080}}
```
   or whichever you prefer, just remove the FRONTEND_HOST reference if you
   haven't already.
4. Add a new volume in the frontend container:
  ```volumes:
       - frontend-dist:/srv
  ```
5. Add a Caddy reverse proxy container below the frontend container:
```
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT}:80"     # ← for localhost
      # - "80:80"
      # - "443:443"
      # - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - frontend-dist:/srv
      - caddy_data:/data
      - caddy_config:/config
```
