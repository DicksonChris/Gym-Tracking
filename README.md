# Gym-Tracking

A gym workout tracker built with [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5, Tailwind + daisyUI) and [PocketBase](https://pocketbase.io/).

- Create **exercises** (muscle groups, measured by weight/reps/distance/time)
- Group them into **workouts**
- Log **history** (sets) per exercise and browse it by month/day
- Per-user **themes** and selected workouts

## Architecture

| Piece | What it is | Port |
| ----- | ---------- | ---- |
| SvelteKit app | UI + server endpoints (`adapter-node`) | 3000 |
| PocketBase | Auth + database (single binary, embedded SQLite) | 8090 |

The SvelteKit server talks to PocketBase using `VITE_POCKETBASE_URL` (baked in at **build time** by Vite). The database schema is version-controlled in [`pb_migrations/`](./pb_migrations) and is applied automatically by PocketBase on first start.

## Proxmox LXC install (recommended)

Installs the app **and** PocketBase together in a single LXC, community-scripts style. Run on your Proxmox VE host shell:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/DicksonChris/Gym-Tracking/main/ct/gym-tracking.sh)"
```

This uses the [community-scripts core](https://github.com/community-scripts/core) engine to:

1. Create a Debian LXC (defaults: 2 vCPU, 2 GB RAM, 6 GB disk — adjustable in the advanced wizard)
2. Install Node.js 22 and the latest PocketBase release
3. Clone this repo to `/opt/gym-tracking`, build it, and apply the DB migrations
4. Create a PocketBase superuser (credentials saved to `/root/gym-tracking.creds` inside the container)
5. Set up and start two systemd services: `gym-tracking` and `pocketbase`

After install:

- App: `http://<container-ip>:3000` — register your user here
- PocketBase dashboard: `http://<container-ip>:8090/_/` — superuser login in `/root/gym-tracking.creds`

To **update** later, run the same one-liner inside the container (or re-run it on the host and pick the existing container), which pulls the latest code and rebuilds.

> **Note:** the app's `ORIGIN` is pinned to the container IP at install time (in `/opt/gym-tracking/.env.node`). If the container's IP changes or you put it behind a reverse proxy, update `ORIGIN` there and `systemctl restart gym-tracking`, otherwise form submissions are rejected by SvelteKit's CSRF protection.

## Local development

1. **PocketBase** — [download](https://pocketbase.io/docs/) the binary for your OS, then from the repo root:

   ```bash
   ./pocketbase serve --http=127.0.0.1:8090 --migrationsDir ./pb_migrations
   ```

   The first run applies the schema migration automatically. Visit `http://127.0.0.1:8090/_/` once to create your superuser (optional — only needed for the admin dashboard).

2. **App** — create `.env` (see [`.env.example`](./.env.example)):

   ```bash
   cp .env.example .env
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173`, register a user, and start tracking.

## Building

```bash
npm run build     # production build (adapter-node)
node build        # serve it (set PORT / ORIGIN env vars)
```

## Repo layout

| Path | Purpose |
| ---- | ------- |
| `src/` | SvelteKit app |
| `pb_migrations/` | PocketBase schema (applied automatically) |
| `ct/`, `install/` | Proxmox community-scripts installer |
