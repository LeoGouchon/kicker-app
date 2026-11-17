# Démarrage

Installer le projet, le configurer et le lancer en local avec les services backend.

## Fichiers clés

- `.env.example` : modèle de configuration à copier en `.env`.
- `Makefile` : cibles `install`, `dev` et `clean` pour les worktrees (Orca).
- `src/auth/config.ts` : lit les variables `VITE_IDENTITY_*` et **lève une erreur au chargement** s'il en manque une.
- `src/vite-env.d.ts` : typage des variables `import.meta.env`.

## Prérequis

- Node.js (un `npm ci` doit passer) et Git Bash ou un shell POSIX pour le `Makefile`.
- Les services backend démarrés séparément, selon leurs propres README :
    - **API Hubscore** : `http://localhost:8080` (`/api/v1`) ;
    - **identity server** : `http://localhost:8081`.

## Installation

```bash
make install    # copie .env depuis le checkout principal (sinon depuis .env.example), puis npm ci
# ou, hors worktree :
cp .env.example .env && npm ci
```

`npm ci` installe aussi le hook Git husky (`prepare`). Au commit, `lint-staged` lance `eslint --fix` et
`prettier --write` sur les fichiers indexés.

## Variables d'environnement

Vite n'expose au navigateur que les variables préfixées `VITE_`.

| Variable                                 | Rôle                                                                                   | Obligatoire |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| `VITE_API_URL`                           | URL de base de l'API (`baseURL` axios, `src/auth/http.ts`)                             | oui         |
| `VITE_IDENTITY_ISSUER`                   | URL de l'identity server (OIDC authority)                                              | oui         |
| `VITE_IDENTITY_CLIENT_ID`                | client OAuth (`kicker-client`)                                                         | oui         |
| `VITE_IDENTITY_REDIRECT_URI`             | retour après login (`http://localhost:5173/`)                                          | oui         |
| `VITE_IDENTITY_POST_LOGOUT_REDIRECT_URI` | retour après logout (`http://localhost:5173/`)                                         | oui         |
| `VITE_IDENTITY_RESOURCE`                 | ressource demandée (`default-api`)                                                     | oui         |
| `VITE_IDENTITY_SCOPE`                    | scopes (`openid profile email`)                                                        | oui         |
| `VITE_MODE`                              | `dev` affiche le tag « Dev mode » dans le header (`src/utils/envChoice.ts`)            | non         |
| `VITE_MOCK_API`                          | `true` remplace axios par `src/utils/mockApi.ts` (**non fonctionnel**, voir tech-debt) | non         |

Les fichiers `.env*` sont ignorés par Git, sauf `.env.example`. Une nouvelle variable doit être ajoutée à
`.env.example`, à `src/vite-env.d.ts` et à ce tableau.

## Commandes

| Commande                                    | Effet                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `make dev`                                  | Vite sur le port **5173** avec `--strictPort` (l'identity server n'autorise que cette URL de redirection) |
| `npm run dev -- --host 0.0.0.0 --port 5173` | idem, accessible depuis le réseau local                                                                   |
| `npm run lint`                              | ESLint sur tout le projet                                                                                 |
| `npm run build`                             | `tsc -b` puis `vite build` : c'est la vérification de types de référence                                  |
| `npm run preview`                           | sert le build de production                                                                               |
| `make clean`                                | supprime `node_modules`, `dist` et `.env` du worktree (le `.env` du checkout principal est conservé)      |

Il n'existe pas de commande de test : aucun test automatisé n'est en place (voir [tech-debt.md](tech-debt.md)).

## Configuration de l'identity server

- Le client `kicker-client` doit autoriser exactement `http://localhost:5173/` en redirection de connexion et de
  déconnexion (et les URL équivalentes de chaque environnement).
- L'origine de l'application doit être autorisée dans la configuration CORS de l'identity server.
- Le détail du flux OIDC est décrit dans [architecture/auth.md](architecture/auth.md).

## Problèmes fréquents

- **Écran blanc avec « Variable d'environnement manquante »** : il manque une variable `VITE_IDENTITY_*` dans `.env`.
- **Redirection OIDC refusée** : le serveur ne tourne pas sur 5173 (port déjà pris). Utiliser `make dev`, qui échoue
  au lieu de changer de port.
- **Le commit ne lance pas lint-staged** : `node_modules` est absent. Relancer `npm ci`.
