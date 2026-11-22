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
- **Tâche 2** : faite. Commit `chore(deps): fix npm audit vulnerabilities`. Avant : 14 vulnérabilités (6 hautes,
  8 modérées : `@humanfs/node`, axios, `brace-expansion`, `follow-redirects`, `js-yaml`, `minimatch`,
  `source-map-js`, Vite). Après : `found 0 vulnerabilities`. Seul `package-lock.json` a changé ; `npm outdated` ne
  montre aucun `Current` au-delà de `Wanted`. Filet : lint 0 erreur / 19 warnings, build ok, tests 59 ok,
  `npm ls` sans erreur. Aucune vulnérabilité restante à reporter.
- **Tâche 3** : faite. Commit `chore(deps): update runtime dependencies to latest minor`. Versions installées :
  `@tanstack/react-query` 5.108.2, antd 6.7.1, axios 1.21.1, `chart.js` 4.6.1, dayjs 1.11.23, react et react-dom
  19.3.1, `react-chartjs-2` 5.3.1, `react-router-dom` 7.18.6, `@fortawesome/react-fontawesome` 0.2.6, `@types/react`
  et `@types/react-dom` 19.3.0. Vérification : script de contrôle sans ligne `dependencies` ; `npm outdated` ne
  liste plus que des `devDependencies` ; lint 0 erreur / 19 warnings, build ok, tests 59 ok sans `Warning` ni
  `deprecated` (identique à la référence) ; `npm ls` sans erreur ; `npm audit` → 0.

## Décisions

Chaque écart au plan ou ambiguïté tranchée, au moment où elle est prise :

- **Tâche 1** : `npm install -D eslint-plugin-unused-imports@^4.1.4` a installé la 4.4.1 ; réinstallé en `@4.1.4`
  pour respecter « sans changer leur version » (la montée se fait en tâche 4) ; aucun coût.
- **Tâche 2** : `npm audit fix` lancé deux fois ; le premier passage laissait `brace-expansion` 1.1.18 (sous
  `eslint` → `minimatch` 3), corrigé par le second en 1.1.22, toujours sans `--force` ni version majeure ; aucun
  coût.
- **Tâche 3** : l'étape 2 (remonter les plages en retard) n'avait rien à faire : `@emotion/*`,
  `chartjs-plugin-annotation`, `oidc-client-ts` et FontAwesome 6 étaient déjà à leur version installée ; aucun coût.
- **Tâche 3** : `npm run build` affiche l'avertissement Vite sur la taille des chunks (> 500 kB, bundle unique sans
  découpage). Non introduit par les montées a priori, mais pas comparé à la référence ; hors périmètre, à regarder
  en vérification.
- **Toutes les tâches** : le journal est commité avec la tâche et cite le commit par son message plutôt que par son
  SHA (un commit ne peut pas contenir son propre SHA, et le message survit aux rebases) ; aucun coût.

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

- Aucun.

## Bilan

À remplir quand toutes les tâches sont faites.
