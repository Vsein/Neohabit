<a names="neohabit" />
<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/logos/neohabit-header-readme-dark.svg" width="1000px" />
    <img src="frontend/src/logos/neohabit-header-readme-light.svg" width="1000px" alt="Neohabit logo" />
  </picture>
</h1>
<p align="center">
  <a href="#installation">Install</a> •
  <a href="#features">Features preview</a> •
  <a href="https://discord.gg/uQ4XdE6raR">Discord</a> •
  <a href="#donations">Donations</a>
</p>

<p align="center">A highly customizable habit-tracker<br> that is wired for systematic self-improvement </p>
<br>

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/neohabit-readme-overview-dark.png" />
    <img src="frontend/src/assets/neohabit-readme-overview-light.png" />
  </picture>
  <sup align="center">zoomed out overview for 6 months </sup>
</div>

## Features

You can see the features overview with examples on the
[landing](https://vsein.github.io/neohabit). The list below repeats its contents:

- Intutive design for habits that happen more than once a day
- Habits happen X times in Y days, where X and Y are positive integers
- Ability to set targets, and change them on the go
- Tracking numeric values and setting numeric targets

### Github/Anki-style heatmaps, with all the above features

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/neohabit-readme-heatmaps-dark.png" />
    <img src="frontend/src/assets/neohabit-readme-heatmaps-light.png" />
  </picture>
</div>

### Other things you might find useful
- [Keybindings](/docs/keybindings.md) for common actions
- Two themes available: light and dark
- Desktop-focused
- A working mobile interface (browser-only, no app)

## Installation

Currently, there are two methods available:

<details>
<summary><strong>Docker compose (recommended)</strong></summary>
<br>

Clone this repo and change to the cloned directory:

```bash
git clone https://github.com/Vsein/Neohabit.git && cd Neohabit
```

Copy `.env.example` into `.env`

```bash
cp .env.example .env
```

After that, edit the following files as desired:

* `.env` to change the db/backend settings, and in-app settings like login behavior
* `docker-compose.yaml` to configure the ports, volumes and other containery things
* `frontend/nginx.conf` to adjust the servername in case you will be web-hosting

When ready, run:

```bash
docker compose up -d
```

In ~30 seconds, head to `http://127.0.0.1:8080` (default) and check if
everything's up and running.

If you encounter any issues, you can check the logs by running:

```bash
docker compose logs
```

<hr>
</details>

<details>
<summary><strong>Build and serve everything manually</strong></summary>
<br>

Requirements:
- go
- postgresql
- npm
- python or nginx (for serving the static files)

### Setting up frontend

Change into the `frontend` directory and install dependencies:

```bash
cd frontend && npm ci
```

- Build static files:

  ```bash
  npm run build
  ```

  Serve the static files in `/dist`, for example with python:

  ```bash
  python -m http.server 8080
  ```

- Or, run in development mode:

  ```bash
  npm start
  ```

### Setting up backend

Change into the `backend` directory and install go packages

```bash
go mod download
```

Create a new Postgres database:

```bash
createdb neohabit_database
```

And modify the env vars before finally running:

```bash
JWT_SECRET="SuperSecretWOWBaz0nga5" \
PG_DSN="postgres://user:password@localhost:5432/neohabit_database?sslmode=disable" \
go run core/cmd/main.go -config core/config/config.yaml
```

<hr>
</details>
<br>

<details>
<summary><strong>Note</strong></summary>
<br>
Given the nature of deploying projects, there's a hundred other ways of
installing I haven't covered. Despite Neohabit being somewhat mature in terms of
features, it's still a young self-hosted tool that I've only recently
open-sourced.
<br>
<br>
It's possible for something not to run as I intended, and if it wastes your
time, I'm sorry. If you figured out how to deploy Neohabit in, say k8s, or your
preferred deployment tool, feel free to propose an installation guide -- a pull
request or just a discord message is fine.

<hr>
</details>


## Ultimate vision

My ultimate vision for Neohabit is to have a public, community-driven archive of
habits that may be imported into your database/account, with all the needed
progressions. Somewhat similar to the Anki's shared decks, except for habits.
I've implemented the core feature - the habit-tracking part, but the rest of it
still needs some time to come together.

For example:
- There's the tasklist section that I want to integrate with habits, so you can
  see which habits are due today (currently the tasks are dangling in their own
  section, and weren't my development focus)
- The skilltrees are implemented, but I'm aware of a couple of bugs there, and
  right now there's no way to start habits directly based on the skills listed
  in the skilltree. I may even take skilltrees as the base for importing new
  habits, I guess it'll be more clear in the future.
- "The blocks" page is dangling as a section in the side menu, but I think it'll
  just be a link to a website with all the archived skilltrees/habits.
- Contribution guides and community support/groups

## Donations

BTC: bc1qkt9xge2a8h3zt65ju7qkyvh6z6qjn6kdz8tm4a

XMR: 48F86e1vigUU8jUSf3kBYNJhMGp38dKxqBhga9sLz1Lr5qM8QqXrY3g4X8uQyqh7wQKhm7MpxSsSpdp1PGvY96jh1MGwyx8

To anyone who's kind enough to donate, thank you! Neohabit's development has
cost me more than I'm comfortable admitting, if not financially then just in time
alone. Spreading the word and mentioning this project to your friends is also
welcome and much appreciated.
