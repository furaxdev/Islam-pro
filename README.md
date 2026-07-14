# Islam Pro

*Votre compagnon musulman au quotidien 🕌*

Application islamique complète (horaires de prière, Coran, Qibla, Dhikr, calendrier
hijri, hadiths, douas…). Monorepo **pnpm** : app Expo (iOS / Android / Web / Desktop),
API Hono (TypeScript), et types partagés.

## Structure (monorepo pnpm)

```
Islam-pro/
├── apps/
│   ├── mobile/       App Expo (React Native + expo-router) — iOS/Android/Web
│   │   └── src-tauri/  Wrapper Tauri → app desktop native (.dmg/.exe)
│   └── api/          API Hono (Node + TypeScript) + MongoDB
├── packages/
│   └── shared/       Types TypeScript partagés entre api et mobile
├── pnpm-workspace.yaml
├── .npmrc            node-linker=hoisted (nécessaire pour Expo/Metro)
└── package.json      Scripts racine (voir ci-dessous)
```

## Prérequis

- **Node** 22+
- **pnpm** (via `corepack enable`, aucune install manuelle)
- Pour le desktop uniquement : **Rust** (`rustup`) + Tauri CLI

## Démarrage rapide

```bash
git clone https://github.com/furaxdev/Islam-pro.git
cd Islam-pro
corepack enable        # active pnpm
pnpm install           # installe TOUT le workspace en une commande
pnpm mobile            # lance l'app Expo (puis 'w' web, 'i' iOS, 'a' Android)
```

## Scripts racine

| Commande             | Effet                                   |
|----------------------|-----------------------------------------|
| `pnpm mobile`        | App Expo (Metro)                        |
| `pnpm mobile:web`    | Expo ciblant le web                     |
| `pnpm mobile:ios`    | Expo ciblant iOS                        |
| `pnpm api`           | API Hono en dev (watch)                 |
| `pnpm lint`          | ESLint sur le mobile                    |
| `pnpm typecheck`     | Typecheck de tous les packages          |

## API (apps/api)

```bash
cp apps/api/.env.example apps/api/.env   # renseigne MONGO_URL / DB_NAME
pnpm api                                  # http://localhost:8000/api/health
```

Endpoints : `GET /api/health`, `POST /api/status`, `GET /api/status`.
Les types de réponse vivent dans `packages/shared` et sont importés **à la fois**
par l'API et par l'app — c'est tout l'intérêt du monorepo.

## App Desktop (Tauri)

```bash
cd apps/mobile
pnpm desktop:build     # génère apps/mobile/src-tauri/target/release/bundle/*
```

## Déploiement

- **Web + API** : Render (voir `render.yaml`) — auto-deploy à chaque push sur `main`.
- **Mobile** : builds EAS (le `projectId` EAS est dans `apps/mobile/app.json`).
- **Desktop** : `.dmg` / `.exe` distribués hors store.

## Note

Le frontend n'utilise **aucune variable d'environnement** — toutes les données
viennent d'APIs publiques (Aladhan, AlQuran Cloud, cdn.islamic.network). Seule
l'API a besoin de `MONGO_URL` / `DB_NAME`.
