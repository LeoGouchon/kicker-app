# Kicker-App

Application web de suivi des matchs et des classements de baby-foot. SPA React 19 + TypeScript + Vite, avec antd et
TanStack Query. L'authentification est déléguée à l'identity server via `oidc-client-ts` (Authorization Code + PKCE
S256).

## Démarrage rapide

```bash
cp .env.example .env   # ou `make install` dans un worktree Orca
npm ci
make dev               # http://localhost:5173 (port imposé par la configuration OIDC)
```

L'identity server et l'API Hubscore sont démarrés séparément, selon leurs README backend (ports `8081` et `8080`).

| Commande        | Effet                                                    |
| --------------- | -------------------------------------------------------- |
| `make dev`      | Serveur de dev sur 5173, échoue si le port est déjà pris |
| `npm run lint`  | ESLint                                                   |
| `npm run build` | Vérification TypeScript + build de production            |

### Worktrees (Orca)

```bash
make install  # à la création du worktree : copie le .env du checkout principal (ou .env.example) + npm ci
make clean    # à la clôture du worktree : supprime node_modules, dist et .env (le .env du checkout principal est préservé)
make dev      # serveur de dev sur 5173, échoue si le port est déjà pris (redirect URI OIDC)
```

## Documentation

Toute la documentation est dans [`docs/`](docs/README.md) :

- [Démarrage et variables d'environnement](docs/getting-started.md)
- [Architecture](docs/architecture/README.md) : providers, routing, données, authentification, thème
- [Conventions](docs/conventions/README.md) : règles de code, structure, style, hooks API, Git
- [Process](docs/process/README.md) : développer une feature, ajouter une page ou un endpoint, PR, release
- [Décisions (ADR)](docs/decisions/README.md) et [dette technique](docs/tech-debt.md)

Les agents IA (Claude Code) démarrent par [`CLAUDE.md`](CLAUDE.md).
