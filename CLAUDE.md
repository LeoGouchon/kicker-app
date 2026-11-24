# CLAUDE.md

Kicker-App : SPA React 19 + TypeScript + Vite + antd 6 + emotion + TanStack Query, qui suit les matchs et les
classements de baby-foot. Authentification OIDC (`oidc-client-ts`), déploiement Vercel.

## Avant de coder

La documentation du projet est dans `docs/`. Son sommaire est importé ci-dessous :

@docs/README.md

1. Lis le sommaire ci-dessus, puis ouvre **uniquement** le `README.md` du ou des dossiers utiles à ta tâche.
2. Dans ce dossier, charge seulement les fichiers dont la ligne « À lire si » correspond à ce que tu fais.
3. Pour une nouvelle feature ou une évolution significative, utilise `/gouchon:feature` (plugin `claude-workflow`, profil du projet dans `.claude/workflow.md`) : cadrer,
   planifier, implémenter, vérifier, avec un fichier par phase dans `specs/<feature>/` (voir `specs/README.md`).
   La checklist de référence reste `docs/process/new-feature.md`.
4. Si le code existant contredit une convention, **la convention l'emporte** pour le nouveau code. L'écart est
   probablement déjà listé dans `docs/tech-debt.md` ; ajoute-le s'il n'y est pas.

## Commandes

```bash
npm ci                 # ou `make install` dans un worktree Orca
make dev               # serveur Vite sur 5173 (port imposé par l'OIDC)
npm run lint           # ESLint
npm run build          # tsc -b + vite build : à lancer avant toute PR
npm test               # Vitest, toute la suite une fois
npm run test:watch     # Vitest en continu
```

## Règles non négociables

- **Imports React** : `import { useState, type ReactNode } from 'react'`. Jamais de `React.useState`, `React.FC`,
  `React.ReactNode` ni d'`import React`.
- **Composants** : fonctions fléchées, **exports nommés** (pas d'`export default`), props typées par un
  `type XxxProps` déclaré juste au-dessus.
- **TypeScript** : pas d'`enum` (utiliser un objet `as const` + type union), `type` plutôt qu'`interface`,
  `import type` pour les types, extensions `.ts`/`.tsx` explicites dans les imports.
- **Structure** : une page par dossier `src/pages/<page-kebab>/` avec ses `components/` et `hooks/` locaux. Ce qui sert
  à plusieurs pages va dans `src/components/` ou `src/hooks/`. Une page n'importe jamais depuis une autre page.
  Tous les dossiers sont en kebab-case. _Transition_ : les pages existantes sont encore dans `src/modules/`. Leur
  migration se fera dans une PR dédiée (voir `docs/tech-debt.md`). Toute nouvelle page va déjà dans `src/pages/`.
- **Fichiers satellites** : `<Composant>.style.tsx` (tout le style), `<Composant>.utils.tsx` (logique pure),
  `<Composant>.reducer.tsx` (état complexe via `useReducer`).
- **Style** : pas de `style={{}}` inline, pas de couleur en dur. Utiliser les tokens antd (`var(--ant-*)`).
  Composants stylés nommés `<Composant><Rôle>` (ex. `MatchCardWrapper`).
- **Données serveur** : uniquement via les hooks TanStack Query de `src/hooks/`, avec une fabrique de query keys
  par ressource.
- **Feedback UI** : `App.useApp()` d'antd (`message`, `modal`, `notification`). Gérer les états chargement, vide et
  erreur de chaque requête.
- **Tests** : toute logique pure créée ou modifiée (`.utils`, `.reducer`, `src/utils/`) a un test colocalisé
  (`x.ts` → `x.test.ts`), imports explicites depuis `vitest`. Détail dans `docs/conventions/testing.md`.
- **Langue** : code, commentaires et commits en anglais ; textes d'interface et documentation en français.
- **Git** : branche `<type>/<kebab>` depuis `dev`, Conventional Commits, PR vers `dev`. Ne jamais pousser sur `main`.

## Règles de la documentation

- **200 lignes visées** par fichier `.md` de `docs/` et pour ce `CLAUDE.md`. Au-delà, un hook
  (`.claude/settings.json`) le signale. Tu **proposes** alors le découpage à l'utilisateur avec `AskUserQuestion` :
  « Découper maintenant », « Pas maintenant » ou « Ne plus demander pour ce fichier ». Tu ne découpes jamais sans son
  accord. Les exceptions assumées sont listées dans `.claude/doc-length-ignore.txt`.
- **Découpage** : `x.md` devient un dossier `x/` avec un `README.md` (visée et sommaire) et des sous-fichiers.
  Le sommaire parent pointe ensuite vers `x/README.md`.
- **Sommaires** : chaque dossier de `docs/` a un `README.md`. Chaque entrée de sommaire donne un lien, une
  description et une ligne « À lire si ». Un nouveau fichier doit y être ajouté.
- **Mise à jour** : une PR qui change une convention, un process ou l'architecture met à jour la doc dans la même PR.
  Une décision structurante donne lieu à un ADR (`docs/decisions/`).
