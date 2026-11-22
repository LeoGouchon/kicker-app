# Journal d'exécution : audit et mise à jour des dépendances

- **Statut** : en cours (cycle des statuts : `specs/README.md`)
- **Plan** : [2-plan.md](2-plan.md)

Le diff de la feature se calcule par `git diff origin/dev...HEAD` (depuis la base commune avec `dev`) : il reste
juste après un rebase, contrairement à un SHA noté ici.

## Références (tâche 1, avant toute mise à jour)

- **Lint** : `npm run lint` → 0 erreur, 19 warnings.
- **Tests** : `npm test` → 6 fichiers, 59 tests passés, 2 ignorés ; aucune ligne `Warning` ni `deprecated`.
- **Prettier** : `npx prettier --check .` signale 16 fichiers : `.prettierrc`, `index.html`, `src/antd.css`,
  `src/components/fullscreenPage/FullscreenPage.style.tsx`, `src/components/fullscreenPage/FullscreenPage.tsx`,
  `src/components/header/components/logged/Logged.style.tsx`, `src/index.css`, `src/modules/notFound/NotFound.tsx`,
  `src/types/Pagination.type.ts`, `src/utils/envChoice.ts`, `src/utils/mockApiResponse/mockedMe.ts`,
  `src/utils/mockApiResponse/mockedPlayer.ts`, `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`,
  `vercel.json`.

## Tâches

Une ligne par tâche, ajoutée quand la tâche est faite. Une tâche absente n'est pas faite.

- **Tâche 1** : faite. Commit `chore(deps): remove unused plots and move eslint plugins to dev dependencies`.
  Vérification : lint 0 erreur / 19 warnings, build ok, tests 59 ok, `npm ls --depth=0` sans erreur ;
  `ant-design/plots` ne subsiste que dans l'ADR 0004.

## Décisions

Chaque écart au plan ou ambiguïté tranchée, au moment où elle est prise :

- **Tâche 1** : `npm install -D eslint-plugin-unused-imports@^4.1.4` a installé la 4.4.1 ; réinstallé en `@4.1.4`
  pour respecter « sans changer leur version » (la montée se fait en tâche 4) ; aucun coût.
- **Toutes les tâches** : le journal est commité avec la tâche et cite le commit par son message plutôt que par son
  SHA (un commit ne peut pas contenir son propre SHA, et le message survit aux rebases) ; aucun coût.

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

- Aucun.

## Bilan

À remplir quand toutes les tâches sont faites.
