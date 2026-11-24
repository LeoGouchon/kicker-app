# Profil du workflow feature

Lu par les skills du plugin `gouchon` (`/gouchon:feature` et ses phases, voir
[l'ADR 0008](../docs/decisions/0008-plugin-workflow.md)). Le déroulé des phases est dans le plugin ; ce fichier dit
seulement ce qui est propre à kicker-app. En cas de conflit avec une skill, **ce profil et les conventions du projet
l'emportent**.

## Projet

- **Stack** : SPA React 19 + TypeScript + Vite, antd 6, emotion, TanStack Query, authentification OIDC
  (`oidc-client-ts`), tests Vitest + Testing Library.
- **Hors du dépôt** : l'API Hubscore (backend Spring Boot, dépôt `hubscore`) et l'identity server. Leurs contrats se
  lisent dans les hooks de `src/hooks/` et les types de `src/types/` qui les appellent déjà.

## Preuves automatiques

- `npm run lint` → 0 erreur
- `npm run build` → exit 0 (vérification TypeScript de référence)
- `npm test` → 0 échec

## Tests

- **Règle** : un test par tâche qui crée ou modifie une logique pure (`.utils`, `.reducer`, `src/utils/`), colocalisé
  (`x.ts` → `x.test.ts`), avec les noms des tests et les valeurs du brief. Un test de composant s'ajoute quand le
  rendu dépend d'une règle du brief.
- **Où et comment** : [docs/conventions/testing.md](../docs/conventions/testing.md) (imports explicites depuis
  `vitest`, `src/test/renderWithProviders.tsx` pour les composants).

## Cadrage

Branches propres au projet :

- **Écran et parcours** : nouvelle page (URL, menu, breadcrumb) ou page existante ; étapes du parcours.
- **Rôles** : anonyme, user, modérateur, admin.
- **États de l'interface** : chargement, vide, erreur ; confirmation et retour après chaque action.

**Contrats externes** : le backend n'est pas dans ce dépôt. Un endpoint déjà appelé dans `src/` existe, et son contrat
se lit dans le hook et le type qui l'utilisent. Pour tout autre endpoint, le code du dépôt `hubscore` peut aider s'il
est présent à côté, mais c'est l'utilisateur qui confirme s'il existe, son contrat et ses droits. Un endpoint encore
« à confirmer » bloque la validation du brief : avant de conclure, l'utilisateur le confirme, ou il est noté « à créer
côté backend » avec le contrat convenu.

## Plan

- **Ordre des tâches** : types → hooks API → page → sous-composants → permissions → états UI
  ([docs/process/new-feature.md](../docs/process/new-feature.md)). Recettes : `docs/process/add-a-page.md`,
  `docs/process/add-an-endpoint.md`.
- **Structure** : page dans `src/pages/<kebab>/` avec ses satellites `.style.tsx` / `.utils.tsx` / `.reducer.tsx` ;
  ce qui sert à plusieurs pages dans `src/components/` ou `src/hooks/`
  ([docs/conventions/project-structure.md](../docs/conventions/project-structure.md)).
- **Où chercher l'existant** : `src/components/`, `src/hooks/`, `src/utils/`, `src/types/`.
- **Interdits à vérifier en auto-relecture** : `style={{}}`, couleur en dur, `export default`, `enum`, `React.*`, page
  qui importe une autre page.

## Vérification en conditions réelles

Parcours dans le navigateur. Lancer `make dev` en arrière-plan (port 5173 imposé par l'OIDC), puis ouvrir l'app :

- dans **Orca**, avec le navigateur intégré (skill `orca-cli`) ;
- sinon avec **Claude in Chrome** (outils `mcp__claude-in-chrome__*` ; charger sa skill si elle est listée, par
  exemple `anthropic-skills:chrome-browser`).

Si le port 5173 est pris (serveur d'un autre worktree), ne pas changer de port : l'OIDC refuse toute autre origine.
Demander à l'utilisateur d'arrêter l'autre serveur, sinon noter le parcours « non vérifié ». Sans navigateur
pilotable, même chose : le parcours passe dans la checklist de l'utilisateur.

**Connexion** : les écrans publics se vérifient sans compte. Pour un écran connecté, utiliser la session déjà ouverte
dans le navigateur (Claude in Chrome reprend celle de l'utilisateur), sinon demander à l'utilisateur de se connecter.
Les rôles demandent des comptes OIDC distincts : ils vont dans sa checklist.

Sur chaque écran touché par la feature :

- **thème clair et sombre** : contrastes, aucune couleur en dur qui jure ;
- **largeur mobile** (sous le breakpoint `md`, 768 px) : pas de débordement ni de contenu coupé ;
- **états chargement, vide et erreur**, quand on peut les provoquer ;
- **navigation** : breadcrumb, menu actif, bouton retour, rechargement sur l'URL.

## Points de revue

- **Droits** : route, menu et boutons cohérents entre eux et avec le brief. Une action réservée qui reste accessible en
  tapant l'URL. Le backend reste l'unique garant.
- **Données** : query keys complètes (tous les paramètres), invalidations qui couvrent les données dérivées (stats,
  ELO, classements), erreur affichée plutôt que spinner infini.
- **Conventions** : `React.*`, `style={{}}`, couleur en dur, `export default`, `enum`, `interface`, `any`,
  `console.log`, page qui importe une autre page, style hors `.style.tsx`, composant stylé mal nommé, feedback hors
  `App.useApp()`.
