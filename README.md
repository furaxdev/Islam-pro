# Islam Pro

Application islamique complète (horaires de prière, Coran, Qibla, Dhikr, calendrier
hijri, hadiths, douas…) — Expo (iOS / Android / Web) + FastAPI.

## Structure du projet

```
Islam-pro/
├── frontend/     App Expo (React Native + expo-router) — TOUT le code produit est ici
├── backend/      Service FastAPI + MongoDB (health-check uniquement pour l'instant)
├── render.yaml   Déploiement Render (backend + frontend web statique)
└── package.json  Raccourcis vers frontend/ (voir ci-dessous)
```

> ⚠️ Le `package.json` de l'app est dans **`frontend/`**, pas à la racine.
> Les commandes ci-dessous fonctionnent depuis la racine grâce aux raccourcis,
> mais tu peux aussi `cd frontend` et lancer les commandes Expo directement.

## Démarrage rapide

```bash
git clone https://github.com/furaxdev/Islam-pro.git
cd Islam-pro
yarn install     # installe les deps du frontend (via postinstall)
yarn start       # lance Metro — puis 'w' (web), 'i' (iOS), 'a' (Android)
```

Ou directement dans le dossier de l'app :

```bash
cd frontend
yarn install
yarn start
```

Le **frontend n'a besoin d'aucune variable d'environnement** — toutes les données
viennent d'APIs publiques (Aladhan, AlQuran Cloud, cdn.islamic.network).

## Backend (optionnel)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # puis renseigne MONGO_URL et DB_NAME
uvicorn server:app --reload
```

## Commandes utiles (frontend)

| Commande        | Effet                              |
|-----------------|------------------------------------|
| `yarn start`    | Serveur de dev Metro               |
| `yarn web`      | Cible le web                       |
| `yarn ios`      | Cible iOS                          |
| `yarn android`  | Cible Android                      |
| `yarn lint`     | ESLint                             |

## Déploiement

- **Web** : Render (voir `render.yaml`) — auto-deploy à chaque push sur `main`.
- **Mobile** : builds EAS (le `projectId` EAS est déjà dans `frontend/app.json`).
