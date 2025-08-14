
# OmniBot (Free Forever) — Slash-Command Modular Discord Bot

A production-ready TypeScript starter that includes:
- Modular slash commands with dynamic loader
- Prisma ORM (SQLite by default; switch to Postgres later by changing `DATABASE_URL`)
- Key features implemented: moderation (ban/kick/timeout/warn/list/clear), logging (edits/deletes/joins/leaves), welcome messages, leveling (XP + level-ups), reminders, polls, giveaways (button to enter), basic tickets (private threads), reaction roles (select menu), config commands, health endpoint, and scaffolding for a web dashboard API (Express).

## Quick Start

```bash
# 1) clone and install
pnpm i   # or npm i / yarn

# 2) configure env
cp .env.example .env
# fill in DISCORD_TOKEN and DISCORD_CLIENT_ID

# 3) init database
pnpm db:push    # or npm run db:push

# 4) register slash commands (global)
pnpm deploy:commands

# 5) run in dev (hot-reload)
pnpm dev
```

## Deploy
- Start free on Railway/Render for the bot + API, Vercel/Netlify for the dashboard.
- Switch DATABASE_URL to Postgres when needed and run `pnpm db:push`.
- Everything uses env vars; no code changes needed.
