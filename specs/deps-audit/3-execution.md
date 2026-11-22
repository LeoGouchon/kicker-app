# Journal d'exécution : audit et mise à jour des dépendances

- **Statut** : terminé (cycle des statuts : `specs/README.md`)
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
- **Tâche 4** : faite. Commit `chore(deps): update tooling to latest minor and typescript 5.9`. Versions installées :
  eslint et `@eslint/js` 9.39.5, `typescript-eslint` 8.73.0, TypeScript 5.9.3, Vite 8.3.8, `@vitejs/plugin-react`
  6.3.0, Prettier 3.10.1, globals 16.5.0, lint-staged 16.4.0, `eslint-plugin-react-refresh` 0.4.26,
  `eslint-plugin-unused-imports` 4.4.1. Vérification : `npx tsc --version` → 5.9.3 ; script de contrôle sans
  aucune ligne ; `npm outdated` ne liste que des majeures (`Current` = `Wanted`), exactement la liste du brief :
  `@eslint/js` et eslint 10, les 4 paquets FontAwesome 6.7.2 → 7.3.1, `react-fontawesome` 0.2.6 → 3.5.0,
  `eslint-plugin-react-hooks` 5.2.0 → 7.1.1, `eslint-plugin-react-refresh` 0.4.26 → 0.5.8,
  `eslint-plugin-simple-import-sort` 12.1.1 → 14.0.0, globals 16.5.0 → 17.14.0, lint-staged 16.4.0 → 17.6.2,
  TypeScript 5.9.3 → 7.0.2 (eslint 9.39.5 → 10.15.0, `@eslint/js` → 10.0.1) ; `npx prettier --check .` → les
  mêmes 16 fichiers qu'en référence ; `npm audit` → 0 ; après `rm -rf node_modules && npm ci` : lint 0 erreur /
  19 warnings, build ok, tests 59 ok, `npm ls` sans erreur. Aucune correction de `src/` ni d'`eslint.config.js`.
- **Tâche 5** : faite. Commit `chore(deps): add dependabot config and dependency update process`. Créés :
  `.github/dependabot.yml`, `docs/process/update-dependencies.md` (93 lignes, 7 sections du brief). Modifiés :
  `docs/process/README.md`, `docs/process/release.md`, `docs/conventions/git-workflow.md`, `docs/tech-debt.md`
  (101 lignes). Vérification : `npx prettier --check .github docs` ok ; YAML relu après parsing (`js-yaml`) contre
  la doc GitHub « Dependabot options reference » ; tous les fichiers de `docs/` touchés sous 200 lignes ; lint
  0 erreur / 19 warnings, build ok.

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
- **Tâche 4** : l'étape 2 n'avait rien à faire : `vitest`, `jsdom`, `@testing-library/*`, `husky`,
  `eslint-config-prettier`, `eslint-plugin-react-hooks` et `eslint-plugin-simple-import-sort` étaient déjà à leur
  version installée (script de contrôle vide) ; aucun coût.
- **Tâche 5** : relecture de la doc GitHub (point de vigilance 5) : Dependabot ajoute un deux-points après un préfixe
  qui finit par `)`, donc `chore(deps)` donne `chore(deps): bump …`. `include: scope` n'est **pas** utilisé (il
  ajouterait `deps` / `deps-dev` après le préfixe). Les groupes ne couvrent par défaut que les mises à jour de
  version (`applies-to` non défini). La doc ne dit pas si `ignore` s'applique aux mises à jour de sécurité, ce qui
  est sans effet ici : elles ne sont pas activées (dette). Coût si c'est faux : un titre de PR à renommer au merge.
- **Tâche 5** : pas de ligne de dette pour une vulnérabilité restante : la tâche 2 n'en a laissé aucune.
- **Tâche 5** : l'en-tête « Relevé du 2026-11-11 » de `tech-debt.md` porte sur tout le fichier ; la nouvelle section
  porte sa propre date (2026-11-22) plutôt que de changer celle du fichier, dont les autres sections n'ont pas été
  relevées à nouveau.
- **Toutes les tâches** : le journal est commité avec la tâche et cite le commit par son message plutôt que par son
  SHA (un commit ne peut pas contenir son propre SHA, et le message survit aux rebases) ; aucun coût.

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

- Aucun.

## Bilan

- **Construit** : `npm audit` passe de 14 vulnérabilités à 0 ; toutes les dépendances sont à leur dernière mineure
  ou corrective (TypeScript 5.9.3), plages de `package.json` alignées sur les versions installées, `@ant-design/plots`
  supprimé et deux plugins ESLint passés en `devDependencies`.
- **Outillé** : `.github/dependabot.yml` (npm et GitHub Actions vers `dev`, hebdomadaire, majeures ignorées), fiche
  `docs/process/update-dependencies.md`, case `npm audit` dans la release, exception `dependabot/...` dans le
  workflow Git, majeures reportées et trois lignes d'outillage dans `tech-debt.md`.
- **Aucun fichier de `src/` modifié**. Filet constant sur les 5 tâches : lint 0 erreur / 19 warnings, build ok,
  59 tests ok, mêmes 16 fichiers signalés par Prettier.
- **À regarder en priorité en vérification** : la CI sur la branche poussée (seul `npm ci` local a été fait) ; les
  montées antd 6.3 → 6.7, React 19.1 → 19.3 et TanStack Query 5.81 → 5.108 ne sont couvertes par aucun test
  d'écran ; l'avertissement Vite sur la taille des chunks (préexistant a priori, non comparé) ; le
  `dependabot.yml` contre la configuration du brief.
