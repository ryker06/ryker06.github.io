# Do It — App Context for Claude Sessions

## What this is
Daily execution board PWA for Adam. Hosted at https://ryker06.github.io.
iOS-first, installable via Add to Home Screen. Push notifications via Cloudflare Worker.

## Design system
- Primary accent: `#FF6B2B` (orange)
- Success: `#34C759` (green)
- Background: `#F5F5F5`, Cards: `#FFFFFF`
- Font: SF Pro (system-ui)
- State key in localStorage: `doit_v2`
- 4 tabs: Today / Meals / Vision / Me

## Key behaviours
- Task check → particle burst + slide-up toast + progress bar fills to 100%
- Daily reset at midnight (tasks un-check, completion date stored)
- No PIN lock
- Desktop: 72px icon sidebar replaces bottom tab bar
- Mobile: bottom tab bar + FAB (orange +)

## Push notifications
- Worker: https://adam-today-push.adamlashin2.workers.dev
- KV namespace: be702dc30f2242e0ad1bed2ec392f2f9
- VAPID public: BAkRnXwUgj1gzn04jv2GCArscugp7Q_kb0vAP7ghTPHuOcDobGAQ61FXmiGoTMLEfjr_lvs3qwXKjIHFLK9tFwM
- Notify secret: adam_notify_2026
- CF account: 717aff941587fd0928897877783243d7
- Worker routes: /subscribe, /notify, /vapid-public-key, /health

## Credentials location
All live credentials stored in Claude outputs folder:
- `push_config.json` — all keys/tokens
- `gh_token.txt` — GitHub PAT (ryker06 account)

## Repo structure
```
/index.html        ← main app (single-file PWA)
/manifest.json     ← PWA manifest (name: "Do It", theme: #FF6B2B)
/sw.js             ← service worker (cache + push handler)
/CLAUDE.md         ← this file
```

## Scheduled task
Daily 8am push → POST https://adam-today-push.adamlashin2.workers.dev/notify
with header `x-notify-secret: adam_notify_2026` and body `{"title":"Do It","body":"Your day is ready."}`

## How to deploy changes
1. Read /sessions/.../outputs/index.html (or rebuild it)
2. base64 encode, GET current SHA from GitHub API, PUT new version
3. GitHub Pages auto-deploys in ~30 seconds

## Task structure (inside index.html)
Tasks defined in JS as array of objects:
```js
{ id: "t1", title: "Morning workout", icon: "🏋️", category: "health", subtasks: ["stretch","lift","cardio"] }
```
State stored in localStorage under key `doit_v2`.

