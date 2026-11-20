# Journal d'exécution : mise en place des tests automatisés et de la CI

- **Statut** : en cours (cycle des statuts : `specs/README.md`)
- **Plan** : [2-plan.md](2-plan.md)

Le diff de la feature se calcule par `git diff origin/dev...HEAD` (depuis la base commune avec `dev`) : il reste
juste après un rebase, contrairement à un SHA noté ici.

## Tâches

Une ligne par tâche, ajoutée quand la tâche est faite. Une tâche absente n'est pas faite.

- **Tâche 1** : faite. Commit `test: set up vitest and testing library`. Vérification : `npm test` → 1 fichier,
  21 tests, 0 échec ; `npm run lint` → 0 erreur (18 warnings existants, aucun dans les nouveaux fichiers) ;
  `npm run build` → exit 0 ; `npm run test:watch` → `RERUN src/utils/roles.test.ts` après modification (annulée).
- **Tâche 2** : faite. Commit `test: add tests for return path and player filter`. Vérification : `npm test` → 3
  fichiers, 35 réussis, 1 en attente ; lint 0 erreur ; build exit 0. Bug révélé (point de vigilance 2) : sonde sans
  `skip` → `Expected "/", Received "/\evil.com"` ; test en `it.skip`, ligne P1 ajoutée à `docs/tech-debt.md`.
- **Tâche 3** : faite. Commit `test: add tests for season changes`. Vérification : `npm test` sous le fuseau de la
  machine, `TZ=Asia/Tokyo` et `TZ=America/Los_Angeles` → trois fois `4 passed (4)`, `42 passed | 2 skipped (44)`.
  Contre-preuve : sans `env: { TZ: 'UTC' }` et sous Tokyo, 3 tests de bord échouent (config restaurée ensuite). Bug
  révélé (point de vigilance 1) : sonde sans `skip` → `Expected [2026-02-10T12:00:00.000Z], Received []` ; test en
  `it.skip`, ligne P1 ajoutée. Lint 0 erreur, build exit 0.
- **Tâche 4** : faite. Commit `test: add tests for duo table utils`. Vérification : `npm test` → 5 fichiers,
  `53 passed | 2 skipped (55)` ; le test « rien de stocké », placé après un test qui écrit, passe (nettoyage du
  `localStorage` prouvé) ; lint 0 erreur ; build exit 0.
- **Tâche 5** : faite. Commit `test: add render helper and match line test`. Vérification : `npm test` → 6 fichiers,
  `59 passed | 2 skipped (61)`, aucune sortie stderr (ni `act`, ni `matchMedia`) ; test 2 contre 2 placé après le
  1 contre 1 → exactement 4 liens (nettoyage du DOM prouvé). Contre-preuve : sans le stub `matchMedia`, les 6 tests
  échouent (`window.matchMedia is not a function`), setup restauré. Lint 0 erreur, build exit 0.
- **Tâche 6** : faite. Commit `docs: add testing conventions and test requirement`. Vérification : `wc -l` → tous les
  fichiers touchés sous 200 lignes (`testing.md` 121, `new-feature.md` 107, `CLAUDE.md` 67) ; liens relatifs des
  fichiers de `docs/` touchés tous résolus ; Prettier appliqué.

## Décisions

Chaque écart au plan ou ambiguïté tranchée, au moment où elle est prise :

- **Tâche 1** : `"test:watch": "vitest watch"` au lieu de `"vitest"` ; sans TTY (agent, terminal non interactif),
  `vitest` seul désactive le watch et s'exécute une fois. La sous-commande force le watch partout ; coût nul.
- **Tâche 1** : npm a retenu `jsdom@29` et non la dernière (31) : jsdom 31 exige Node `^24.15`, la machine locale est en
  24.12. jsdom 29 tourne sur tout Node 24 ; à monter quand le Node local suivra.
- **Tâche 1** : `server.deps.inline: ['antd']` non ajouté : pas nécessaire à ce stade, à revoir en tâche 5 si antd ne
  se charge pas.
- **Tâche 4** : test nommé `EnhancedTable.utils.test.tsx` et non `.test.ts` (carte des fichiers) : la source est en
  `.tsx`, et la contrainte globale dit `X.tsx` → `X.test.tsx`. Coût nul.
- **Tâche 4** : assertions en `toStrictEqual` (et non `toEqual`) sur les filtres lus : `toEqual` ne distingue pas
  `{}` de `{ playerIdFilter: undefined, … }`, ce que le plan demande de vérifier.
- **Tâche 5** : `server.deps.inline: ['antd']` reste inutile : antd se charge sous Vitest sans réglage.
- **Tâche 5** : `"Il y a moins d'une minute"` garde ses guillemets doubles, d'où 1 warning `quotes` dans
  `MatchLine.test.tsx` (lint : 19 warnings au lieu de 18). La règle ESLint `quotes: single` (réactivée après
  `eslint-config-prettier`) contredit Prettier, qui préfère les doubles pour éviter un échappement ; le pre-commit
  lance Prettier en dernier, donc sa version gagne. Même warning déjà présent dans `MatchLine.tsx`. Conflit d'outillage
  à reporter dans la dette en phase Vérifier (piste : `avoidEscape: true` sur la règle `quotes`).

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

Aucun pour l'instant.

## Bilan

À remplir quand toutes les tâches sont faites.
