# Guides for upgrading to a newer version

To upgrade images to a newer version:
- Use `docker compose pull` to fetch the latest pre-built images.
- For manual rebuilding, run `git pull` followed by `docker compose up --build --force-recreate`

## v1.0.0 → v1.1.0: deployment adjustments

In the previous version, I made several mistakes by leaving ports exposed in
`docker-compose`. When some people tried closing them, they ran into issues
because I had baked `nginx.conf` into the frontend image and exposed variables
that had no deal being customizable, which understandbly caused confusion.

I made a slight overhaul: internal ports are now hardcoded (where they should
have been container-internal from the start), and all needlessly exposed ports
have been removed.

I also removed nginx out of the frontend image, decreasing its size from ~64MB
to 6.7MB. While it isn't the smallest it could be, it's already a 10x reduction.

### Recommended actions:

**Option 1 (simpler):** Backup your previous configs, then copy the new
`docker-compose.yaml`, `.env.example` and `Caddyfile`:

```bash
wget -O docker-compose.yaml https://raw.githubusercontent.com/Vsein/Neohabit/refs/heads/main/docker-compose.yaml &&
wget -O .env https://raw.githubusercontent.com/Vsein/Neohabit/refs/heads/main/.env.example &&
wget -O Caddyfile https://raw.githubusercontent.com/Vsein/Neohabit/refs/heads/main/Caddyfile
```

Then reapply any custom changes you need. The list below can be used as a
reference for what has changed or been deprecated.

**Option 2:** If you prefer to adjust your existing `v1.0.0` configuration:

0. If already using pre-built images - skip this step. Otherwise:
    - If you were building images manually for web-hosting (as was previously instructed), then
    there's no longer any need for that and you no longer need to `git clone` the
    entire repo. If you still prefer to be building things yourself, remove
    `/frontend/nginx.conf.template` (or `git pull`) as it's no longer used.
1. Remove unused vars from `.env`:
    - FRONTEND_HOST
    - BACKEND_PORT
2. Remove unused fields/environment vars from `docker-compose.yaml`:
    - postgres.ports
    - backend.environment.ADDRESS
    - backend.environment.BACKEND_PORT
    - backend.ports
    - frontend.environment.API_URL
    - frontend.environment.BACKEND_PORT
    - frontend.ports
3. Change the backend.environment.FRONTEND_URL in `docker-compose.yaml` to:
```yaml
  backend:
    environment:
      FRONTEND_URL: ${FRONTEND_URL:-http://127.0.0.1:${FRONTEND_PORT:-8080}}
      # or whichever URL you prefer, just remove the FRONTEND_HOST reference if you
      # haven't already.
```
4. Add FRONTEND_URL in `.env`:
  ```yaml
# URL from which you'll be accessing Neohabit from (required for CORS)
FRONTEND_URL=http://127.0.0.1:8080                  # ← or http://localhost:8080
# FRONTEND_URL=https://neohabit.example.com           # ← for production
  ```
5. Add a new volume in the frontend container:
  ```yaml
     volumes:
       - frontend-dist:/srv
  ```
6. Add a Caddy reverse proxy container below the frontend container:
```yaml
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "127.0.0.1:${FRONTEND_PORT:-8080}:80"     # ← for localhost-only
      # - "${FRONTEND_PORT:-8080}:80"               # ← for LAN
      # - "${FRONTEND_PORT:-8080}:443"              # ← for LAN + HTTPS
      # - "80:80"                                   #   │
      # - "443:443"                                 # ◄─┤ for web-hosting
      # - "443:443/udp"                             #   │
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - frontend-dist:/srv
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend
    networks:
      - neohabit-network     # ← change if you named it differently
```
7. Adjust previously copied `Caddyfile` as desired (or use a different reverse proxy, see [snippets](https://github.com/Vsein/Neohabit/tree/main/docs/snippets) for sample configs):
    - `:80` for LAN or localhost
    - `:443` for LAN+HTTPS (also uncomment the `tls internal` and frontend's
      reverse proxy)
    - `example.com` for web-hosting
