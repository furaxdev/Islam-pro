# Islam Pro

![Islam Pro](apps/mobile/store-assets/play-feature-graphic-1024x500.png)

Application islamique complète (horaires de prière, Coran, Qibla, Dhikr, calendrier
hijri, hadiths, douas…). **Islam Pro Workspace** (pnpm) : app Expo (iOS / Android / Web / Desktop),
API Hono (TypeScript), et types partagés.

Site vitrine : **[islam-pro.vercel.app](https://islam-pro.vercel.app)**

## Télécharger

- <a href="https://expo.dev/artifacts/eas/4mhBdkvnrnQRGsIC313vpe0XXc2rkuhHQW0vhx_y02E.apk"><img src="https://cdn.simpleicons.org/android/3DDC84" width="18" height="18" alt="Android" valign="middle"></a> **Android (APK)** : [télécharger la dernière version](https://expo.dev/artifacts/eas/4mhBdkvnrnQRGsIC313vpe0XXc2rkuhHQW0vhx_y02E.apk)
  — ouvre ce lien depuis le téléphone, installe l'APK (autorise « sources inconnues » si demandé).
- <a href="https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro.Installer.dmg"><img src="https://cdn.simpleicons.org/apple/888888" width="18" height="18" alt="macOS" valign="middle"></a> **macOS (.dmg)** : [télécharger la dernière version](https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro.Installer.dmg)
  — app non signée Apple : au premier lancement, **clic droit sur l'app → Ouvrir → Ouvrir**
  (voir [App Desktop (Tauri)](#app-desktop-tauri) pour le générer soi-même).
- 🪟 **Windows (.exe)** : [télécharger la dernière version](https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro_1.0.0_x64-setup.exe)
  — app non signée Microsoft : si SmartScreen avertit, **Informations complémentaires → Exécuter quand même**.
- <a href="https://dl.cloudsmith.io/public/furax-dev/islam-pro/deb/ubuntu/jammy/"><img src="https://cdn.simpleicons.org/ubuntu/E95420" width="18" height="18" alt="Linux" valign="middle"></a> **Linux (Ubuntu/Debian)** : une seule commande (ajoute le dépôt APT + installe) :
  ```bash
  curl -fsSL https://islam-pro.vercel.app/install | sudo -E bash
  ```
  Mises à jour ensuite via `sudo apt update && sudo apt upgrade`. Ou juste le fichier
  `.deb` : [télécharger la dernière version](https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro_1.0.0_amd64.deb)
  (`sudo apt install ./islam-pro.deb`).
- <a href="#déploiement"><img src="https://cdn.simpleicons.org/apple/888888" width="18" height="18" alt="iOS" valign="middle"></a> **iOS** : build EAS à venir (nécessite un compte Apple Developer).

> Le lien de l'APK provient d'EAS Build et peut expirer au bout de ~30 jours ;
> reconstruis avec `eas build --platform android --profile preview` (depuis
> `apps/mobile/`) pour en régénérer un.

## Structure du projet

```
Islam-pro/
├── apps/
│   ├── mobile/       App Expo (React Native + expo-router) — iOS/Android/Web
│   │   └── src-tauri/  Wrapper Tauri → app desktop native (.dmg/.exe)
│   ├── api/          API Hono (Node + TypeScript) + MongoDB
│   └── site/         Site vitrine Next.js, déployé sur Vercel
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

| Commande               | Effet                                   |
|------------------------|-----------------------------------------|
| `pnpm mobile`          | App Expo (Metro)                        |
| `pnpm mobile:web`      | Expo ciblant le web                     |
| `pnpm mobile:ios`      | Expo ciblant iOS                        |
| `pnpm mobile:android`  | Expo ciblant Android                    |
| `pnpm api`             | API Hono en dev (watch)                 |
| `pnpm lint`            | ESLint sur le mobile                    |
| `pnpm typecheck`       | Typecheck de tous les packages          |

## API (apps/api)

```bash
cp apps/api/.env.example apps/api/.env   # renseigne MONGO_URL / DB_NAME
pnpm api                                  # http://localhost:8000/api/health
```

Endpoints : `GET /api/health`, `POST /api/status`, `GET /api/status`.
Les types de réponse vivent dans `packages/shared` et sont importés **à la fois**
par l'API et par l'app — c'est tout l'intérêt du monorepo.

## App Desktop (Tauri)

Le wrapper Tauri embarque le build web de l'app Expo dans une fenêtre native
(macOS `.dmg`, Windows `.exe`). Nécessite **Rust** + la Tauri CLI.

```bash
cd apps/mobile
pnpm desktop:build     # génère apps/mobile/src-tauri/target/release/bundle/*
```

Pour produire l'installeur macOS prêt à distribuer (renomme le volume + copie le
`.dmg` final dans `apps/mobile/builds/`) :

```bash
cd apps/mobile/src-tauri
bash build-installer.sh              # CPU illimité
CARGO_BUILD_JOBS=4 bash build-installer.sh   # limite la compilation Rust à 4 cœurs
```

**Build sans charger le CPU local** : `.github/workflows/build-desktop.yml` compile le `.dmg`
sur les runners macOS de GitHub Actions (déclenchement manuel) :

```bash
gh workflow run build-desktop.yml
# une fois terminé : télécharger l'artefact, puis appliquer le style Finder en local
gh run download <run-id> --name islam-pro-installer-dmg --dir apps/mobile/builds
bash apps/mobile/src-tauri/finalize-dmg-style.sh "apps/mobile/builds/Islam Pro Installer.dmg"
```

Le style Finder (fond personnalisé, position des icônes) doit être appliqué en local
car il dépend d'une session graphique (AppleScript/Finder), indisponible en CI.

## Notifications

L'app peut notifier chaque prière avec le son de l'Adhan, au choix parmi **4 enregistrements**
libres de droits (Réglages → Choix de l'Adhan, avec écoute intégrale avant sélection) :
Grande Mosquée de La Mecque, Masjid al-Haram (Maghrib), Mosquée Hassan II (Casablanca), et
un enregistrement classique CC0. Voir `src/data/adhanSounds.ts` pour le détail des licences.

- **iOS / Android** : notifications locales programmées via `expo-notifications`. Chaque
  Adhan a un court clip WAV (~15 s, format imposé par iOS pour un son de notif personnalisé)
  déclaré dans `app.json`.
- **Desktop (Tauri)** : `expo-notifications` étant inopérant dans la WebView (WKWebView
  n'implémente pas l'API `Notification` du navigateur), les notifs passent par
  `tauri-plugin-notification` (vraies notifications macOS natives). Le son est joué
  séparément via l'API Web Audio (`AudioContext`, pas un `<audio>`) pour éviter qu'il
  s'enregistre comme session média dans le Centre de contrôle. Limite : les notifs
  programmées ne se déclenchent que **quand l'app est ouverte** (pas de service en
  arrière-plan dans la WebView).
- **Debug desktop** : dans l'onglet Prière, taper sur une prière déclenche sa notification
  immédiatement (aucun moyen d'avancer l'horloge pour tester le déclenchement réel).

Un bouton **« Notification de test »** est disponible dans les réglages. Chaque Adhan a
aussi une version longue compressée (AAC/M4A) utilisée uniquement pour l'écoute intégrale
dans le sélecteur, jamais pour la notif elle-même.

## Déploiement

- **Render est abandonné** — l'app n'est plus distribuée comme site hébergé.
- **Mobile** : builds EAS (le `projectId` EAS est dans `apps/mobile/app.json`).
- **Desktop** : `.dmg` (macOS, via `build-desktop.yml`) / `.exe` (Windows, NSIS) / `.deb`
  (Linux) distribués hors store — les deux derniers via `build-desktop-other.yml`
  (`gh workflow run build-desktop-other.yml`). Les trois sont publiés comme assets de la
  [GitHub Release `desktop-latest`](https://github.com/furaxdev/Islam-pro/releases/tag/desktop-latest)
  (mise à jour via `gh release upload desktop-latest <fichier> --clobber`) et liés
  depuis le site vitrine et ce README. Le `.deb` est en plus publié automatiquement
  sur un [dépôt APT Cloudsmith](https://cloudsmith.io/~furax-dev/repos/islam-pro/)
  (repo `furax-dev/islam-pro`, dernière étape du job `linux` dans
  `build-desktop-other.yml`, clé API dans le secret GitHub `CLOUDSMITH_API_KEY`).

## Note

Le frontend n'utilise **aucune variable d'environnement** — toutes les données
viennent d'APIs publiques (Aladhan, AlQuran Cloud, cdn.islamic.network). Seule
l'API a besoin de `MONGO_URL` / `DB_NAME`.

## Crédits

Les 4 sons de l'Adhan (Réglages → Choix de l'Adhan), tous vérifiés sur Wikimedia Commons :

- Grande Mosquée de La Mecque — Seyfula Islam, **CC BY 3.0**.
- Masjid al-Haram (Maghrib) — 3omar Faruq, **CC BY 3.0**.
- Mosquée Hassan II, Casablanca — Fraguando, **CC BY-SA 4.0**.
- Adhan classique — Adam-synagda, **CC0**.

## License

© 2026 furaxdev — distribué sous **[PolyForm Noncommercial License 1.0.0](./LICENSE)**.

Usage, modification et redistribution libres à des fins **non commerciales**
(personnel, éducatif, associatif, religieux…). Toute exploitation commerciale
nécessite une autorisation. Les sons de l'Adhan conservent chacun leur propre
licence (voir Crédits).
