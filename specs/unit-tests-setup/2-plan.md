# Plan : mise en place des tests automatisés et de la CI

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md)
- **Exécution** : dans la conversation (7 tâches d'implémentation, plus 1 tâche après le merge)

**Objectif** : installer Vitest et Testing Library, écrire les tests pilotes du brief, et vérifier lint, build et
tests en CI sur chaque PR vers `dev` et `main`.

**Approche** : Vitest se configure dans le `vite.config.ts` existant (bloc `test`), sans second fichier de config. Le
helper de rendu réutilise le `ThemeProvider` de l'app (antd `ConfigProvider` + `App` + emotion). Aucun fichier
applicatif n'est modifié : seuls des fichiers `*.test.ts(x)`, `src/test/`, la config, la CI et la doc changent.

**Taille** : environ 550 lignes hors `specs/` et `package-lock.json`, dont ~300 de tests et ~150 de doc. Le brief a
décidé de livrer tests et CI ensemble, et les tests pilotes n'ont de valeur qu'avec l'outillage : pas de découpage.

## Contraintes globales

- **Imports explicites** depuis `vitest` (`describe`, `it`, `expect`, `vi`, `afterEach`…) : `globals` reste à `false`.
- **Fichiers colocalisés** : `x.ts` → `x.test.ts`, `X.tsx` → `X.test.tsx`. Inclus par `src/**/*.test.{ts,tsx}`.
- **Descriptions en anglais** (`describe`/`it`), forme `it('returns / when …')`.
- **Requêtes Testing Library** par rôle (`getByRole`) ou par texte visible (`getByText`), jamais par classe CSS ni
  `data-testid` tant qu'un rôle ou un texte suffit.
- **Dates** : fuseau fixé à `UTC` pour toute la suite (`test.env.TZ`), horloge figée avec
  `vi.useFakeTimers({ toFake: ['Date'] })` + `vi.setSystemTime(...)` dans les tests qui lisent l'heure courante.
- **Aucun changement de code applicatif** : un bug révélé → `it.skip` + commentaire `// Pending: docs/tech-debt.md, "<sujet>"`,
  ligne ajoutée à `docs/tech-debt.md` (P1), et proposition d'issue GitHub à l'utilisateur (créée seulement s'il
  valide).
- **Versions** : dernières versions stables compatibles avec `vite ^8` (vérifier les `peerDependencies` de `vitest`
  avant d'installer). Node `24.x`.
- Les tests sont typés par `tsc -b` (ils sont dans `src/`, donc dans `tsconfig.app.json`) et lintés par `eslint .`.

## Points de vigilance

1. `getQuarterChanges` compare seulement l'index du trimestre (`getMonth() / 3`), pas l'année : deux dates en T1 2025
   puis T1 2026 ne donnent **aucun** marqueur alors que la saison a changé → bug probable, géré selon la règle des
   bugs (vérifié en tâche 3).
2. `getReturnTo` accepte `/\evil.com` : il commence par `/` mais pas par `//`, alors que le navigateur le lit comme
   `//evil.com` (redirection externe) → cas ajouté au test, attendu `/` ; s'il échoue, règle des bugs (tâche 2).
3. `MatchLine` appelle `useBreakpoint` d'antd, qui lit `window.matchMedia`, absent de jsdom → le setup le simule
   (`matches: false`), sinon le rendu plante (tâche 1, prouvé en tâche 5).
4. Sans `globals`, Testing Library ne nettoie plus le DOM entre deux tests, et le `localStorage` de jsdom persiste
   dans un même fichier → le setup appelle `cleanup()` et `localStorage.clear()` après chaque test (tâche 1, prouvé
   en tâches 4 et 5 par des comptes exacts après un test précédent).
5. Rendre le check obligatoire avant que le workflow soit dans `dev` bloquerait les autres PR (check jamais rapporté,
   « en attente » sans fin) → les rulesets sont modifiés **après le merge** seulement (tâche 8). Le fuseau de la
   machine ne doit pas compter non plus : suite relancée sous deux autres fuseaux (tâche 3).

## Carte des fichiers

| Fichier                                                                                 | Action           | Responsabilité                                                     |
| --------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------ |
| `package.json`                                                                          | modifier         | devDependencies de test, scripts `test` et `test:watch`, `engines` |
| `vite.config.ts`                                                                        | modifier         | bloc `test` (jsdom, setup, include, `TZ`)                          |
| `src/test/setup.ts`                                                                     | créer            | matchers jest-dom, `matchMedia`, nettoyage après chaque test       |
| `src/test/renderWithProviders.tsx`                                                      | créer            | rendu avec QueryClient, router et thème antd ; renvoie `user`      |
| `src/utils/roles.test.ts`                                                               | créer            | tests pilotes `roles`                                              |
| `src/auth/returnTo.test.ts`                                                             | créer            | tests pilotes `getReturnTo`                                        |
| `src/utils/apiConstruct/constructComplexPlayerFilter.test.ts`                           | créer            | tests pilotes du filtre joueurs                                    |
| `src/utils/quarterChanges.test.ts`                                                      | créer            | tests pilotes des saisons                                          |
| `src/modules/duo/components/enhancedTable/EnhancedTable.utils.test.ts`                  | créer            | tests pilotes filtres, bornes, pourcentage                         |
| `src/components/matchLine/MatchLine.test.tsx`                                           | créer            | test du composant témoin                                           |
| `.github/workflows/ci.yml`                                                              | créer            | lint, build, tests sur les PR vers `dev` et `main`                 |
| `.github/pull_request_template.md`                                                      | modifier         | `npm test` dans le plan de test                                    |
| `docs/conventions/testing.md`, `docs/conventions/README.md`                             | créer / modifier | conventions d'écriture des tests et entrée de sommaire             |
| `CLAUDE.md`, `docs/getting-started.md`                                                  | modifier         | commandes de test                                                  |
| `docs/process/new-feature.md`, `docs/process/pull-request.md`                           | modifier         | exigence de tests, CI, procédure du check obligatoire              |
| `docs/tech-debt.md`                                                                     | modifier         | retirer « Aucun test » et « Pas de CI », ajouter les bugs trouvés  |
| `.claude/skills/planifier/SKILL.md`, `.claude/skills/verifier/verification-template.md` | modifier         | rappel de l'exigence de tests, ligne `npm test` du rapport         |

L'ADR 0007 et son entrée de sommaire existent déjà (phase Cadrer) : rien à créer.

---

### Tâche 1 : outillage Vitest et premier test (`roles`)

**Fichiers** :

- Modifier : `package.json`, `vite.config.ts`, `CLAUDE.md`, `docs/getting-started.md`
- Créer : `src/test/setup.ts`, `src/utils/roles.test.ts`

**Interfaces** :

- Fournit : `npm test` (`vitest run`), `npm run test:watch` (`vitest`), le setup global utilisé par toutes les tâches.

- [ ] **Étape 1** : `npm i -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom`.
- [ ] **Étape 2** : `package.json` : scripts `"test": "vitest run"` et `"test:watch": "vitest"` ;
      `"engines": { "node": "24.x" }`.
- [ ] **Étape 3** : `vite.config.ts` : ajouter `/// <reference types="vitest/config" />` en tête et un bloc
      `test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}'], setupFiles: ['./src/test/setup.ts'], env: { TZ: 'UTC' } }`.
      Si antd échoue à se charger en ESM sous Vitest, ajouter `server: { deps: { inline: ['antd'] } }` dans `test` et
      le noter au journal.
- [ ] **Étape 4** : `src/test/setup.ts` : `import '@testing-library/jest-dom/vitest'` ; stub de `window.matchMedia`
      (via `Object.defineProperty`, `writable: true`) qui renvoie `matches: false` et des écouteurs `vi.fn()`
      (`addListener`, `removeListener`, `addEventListener`, `removeEventListener`, `dispatchEvent`) ;
      `afterEach(() => { cleanup(); localStorage.clear(); })`.
- [ ] **Étape 5** : `src/utils/roles.test.ts`, un `describe` par fonction, avec `it.each` :
    - `hasRole` : `{ role: 'ADMIN' }` + `'ADMIN'` → `true` ; `{ role: 'USER' }` + `'ADMIN'` → `false` ; `null`,
      `undefined`, `{}` (sans rôle, typé `Pick<UserType, 'role'>` par cast) → `false` ;
    - `hasAnyRole` : `{ role: 'MODERATOR' }` + `['ADMIN', 'MODERATOR']` → `true` ; `{ role: 'USER' }` → `false` ;
      liste vide → `false` ; `null` / `undefined` / sans rôle → `false` ;
    - `isAdmin` : `ADMIN` → `true` ; `MODERATOR`, `USER`, `null`, `undefined` → `false` ;
    - `isModeratorOrAdmin` : `ADMIN`, `MODERATOR` → `true` ; `USER`, `null`, `undefined` → `false`.
- [ ] **Étape 6** : doc des commandes :
    - `CLAUDE.md` : `npm test` et `npm run test:watch` dans le bloc Commandes ; supprimer « Il n'y a pas de tests
      automatisés… » (le renvoi vers `testing.md` vient en tâche 6) ;
    - `docs/getting-started.md` : prérequis « Node.js 24 (`engines` de `package.json`) » ; deux lignes au tableau des
      commandes ; supprimer « Il n'existe pas de commande de test… ».
- [ ] **Étape 7** : vérifier : `npm test` → 1 fichier, 0 échec ; `npm run lint` → 0 erreur ; `npm run build` → exit 0 ;
      `npm run test:watch` démarre, relance après une modification de `roles.test.ts` (puis annuler la modification).
- [ ] **Étape 8** : commit `test: set up vitest and testing library`.

### Tâche 2 : tests de `getReturnTo` et `constructComplexPlayerFilter`

**Fichiers** :

- Créer : `src/auth/returnTo.test.ts`, `src/utils/apiConstruct/constructComplexPlayerFilter.test.ts`

- [ ] **Étape 1** : `returnTo.test.ts` :
    - `{ returnTo: '/players/42?tab=elo' }` → `'/players/42?tab=elo'` ;
    - `undefined`, `null`, `'oops'`, `{}`, `{ returnTo: 42 }`, `{ returnTo: 'players' }` → `'/'` ;
    - `{ returnTo: 'https://evil.com' }`, `{ returnTo: '//evil.com' }`, `{ returnTo: '/\\evil.com' }` → `'/'`
      (point de vigilance 2).
- [ ] **Étape 2** : `constructComplexPlayerFilter.test.ts` :
    - `undefined` → `''` ;
    - `{ operator: 'AND', playerGroups: [] }` → `'&filter.operator=AND'` ;
    - un groupe `{ operator: 'WITH', playerIds: ['p1', 'p2'] }` →
      `'&filter.operator=AND&filter.groups[0].operator=WITH&filter.groups[0].playerIds[0]=p1&filter.groups[0].playerIds[1]=p2'` ;
    - deux groupes (`WITH` puis `AGAINST`, opérateur `OR`) → indices `groups[0]` et `groups[1]`, chacun avec ses
      `playerIds` indexés depuis 0 ;
    - encodage : `playerIds: ['a b&c']` → contient `playerIds[0]=a%20b%26c`.
- [ ] **Étape 3** : vérifier : `npm test` → 0 échec (hors `it.skip` documenté) ; `npm run lint` ; `npm run build`.
- [ ] **Étape 4** : si un cas échoue : règle des bugs (contraintes globales), dans le même commit.
- [ ] **Étape 5** : commit `test: add tests for return path and player filter`.

### Tâche 3 : tests des saisons (`quarterChanges`) et indépendance au fuseau

**Fichiers** :

- Créer : `src/utils/quarterChanges.test.ts`
- Modifier (si bug) : `docs/tech-debt.md`

- [ ] **Étape 1** : `getQuarterChanges` (entrées `EloHistory[]` construites avec `elo: 1000`, dates ISO en `Z`) :
    - `[]` → `[]` ; dates toutes en T4 2026 → `[]` ;
    - `2026-03-31T23:30:00Z`, `2026-04-01T00:30:00Z`, `2026-07-15T10:00:00Z` → deux marqueurs, égaux à
      `new Date('2026-04-01T00:30:00Z')` et `new Date('2026-07-15T10:00:00Z')` (dates de bord : un autre fuseau
      les ferait échouer) ;
    - les mêmes dates dans le désordre → même résultat ;
    - `2025-02-10T12:00:00Z` puis `2026-02-10T12:00:00Z` → un marqueur (point de vigilance 1 : échec attendu → règle
      des bugs, sujet « `getQuarterChanges` ignore l'année »).
- [ ] **Étape 2** : `getQuarterLabel` : `2026-01-01T00:00:00Z` → `'2026-1'` ; `2026-12-31T23:59:59Z` → `'2026-4'` ;
      `2026-04-01T00:00:00Z` → `'2026-2'`.
- [ ] **Étape 3** : vérifier sous trois fuseaux (Git Bash) : `npm test`, `TZ=Asia/Tokyo npm test`,
      `TZ=America/Los_Angeles npm test` → mêmes résultats, 0 échec. Noter les trois sorties au journal.
- [ ] **Étape 4** : commit `test: add tests for season changes`.

### Tâche 4 : tests d'`EnhancedTable.utils`

**Fichiers** :

- Créer : `src/modules/duo/components/enhancedTable/EnhancedTable.utils.test.ts`

- [ ] **Étape 1** : fabrique locale `buildRow(value: number): TableData` (les sept métriques à `{ rank: 1, value }`,
      joueurs factices).
- [ ] **Étape 2** : `getStoredFilters` / `storeFilters` (clé `'kicker.duo.enhancedTable.filters'`) :
    - rien de stocké → `{}` ;
    - `'{oops'`, `'42'`, `'null'` stockés → `{}` ;
    - `{ playerIdFilter: 'p1', visibleMetricKeys: ['winRate', 'unknown'] }` → `{ playerIdFilter: 'p1', visibleMetricKeys: ['winRate'] }` ;
    - `{ visibleMetricKeys: ['unknown'], playerIdFilter: 3 }` → `{ playerIdFilter: undefined, visibleMetricKeys: undefined }` ;
    - `storeFilters({ playerIdFilter: 'p2', visibleMetricKeys: ['matches'] })` puis lecture brute de la clé → le JSON
      correspondant, et `getStoredFilters()` → le même objet ;
    - placer le test « rien de stocké » **après** un test qui écrit (point de vigilance 4).
- [ ] **Étape 3** : `getTopBottomByMetric` :
    - 4 lignes → `{ top: undefined, bottom: undefined }` pour chaque métrique de `metrics` ;
    - 6 lignes de valeurs `10, 20, 30, 40, 50, 60` (dans le désordre) → `{ top: 20, bottom: 50 }` pour chaque métrique.
- [ ] **Étape 4** : `renderMetricValue` : métrique `winRate` (pourcentage) valeur `55` → `'55%'` ; métrique `matches`
      valeur `12` → `12`.
- [ ] **Étape 5** : vérifier : `npm test` ; `npm run lint` ; `npm run build`. Commit `test: add tests for duo table utils`.

### Tâche 5 : helper de rendu et test de `MatchLine`

**Fichiers** :

- Créer : `src/test/renderWithProviders.tsx`, `src/components/matchLine/MatchLine.test.tsx`

**Interfaces** :

- Fournit : `renderWithProviders(ui: ReactElement, options?: { route?: string }): RenderResult & { user: UserEvent }`.
  Un `QueryClient` neuf par appel (`retry: false` pour queries et mutations), `MemoryRouter`
  (`initialEntries: [options.route ?? '/']`), `ThemeProvider` de `src/context/ThemeProvider.tsx`. `user` vient de
  `userEvent.setup()`.

- [ ] **Étape 1** : écrire `renderWithProviders.tsx` selon l'interface ci-dessus.
- [ ] **Étape 2** : `MatchLine.test.tsx`, fabrique locale `buildMatch(overrides?: Partial<Match>): Match` (joueurs
      `léo gouchon`, `marie curie`, `ada lovelace`, `alan turing` ; scores `10` et `7`). Horloge figée sur
      `2026-11-20T12:00:00Z` (`vi.useFakeTimers({ toFake: ['Date'] })`, `vi.useRealTimers()` en `afterEach`) :
    - 1 contre 1 (`player2A`/`player2B` absents) → exactement 2 `link` ;
    - 2 contre 2 → exactement 4 `link` (test placé après le 1 contre 1 : point de vigilance 4) ;
    - liens nommés `'Léo G.'`, `'Marie C.'`… (`getByRole('link', { name: 'Léo G.' })`) ;
    - scores : `getByText('10')` et `getByText('7')` présents ;
    - `createdAt` à `2026-11-20T10:00:00Z` → `getByText('Il y a 2 heures')` ; à `2026-11-20T11:59:30Z` →
      `getByText("Il y a moins d'une minute")`.
- [ ] **Étape 3** : vérifier : `npm test` (aucune erreur `matchMedia`), `npm run lint`, `npm run build`.
- [ ] **Étape 4** : commit `test: add render helper and match line test`.

### Tâche 6 : conventions de test et exigence dans le process

**Fichiers** :

- Créer : `docs/conventions/testing.md`
- Modifier : `docs/conventions/README.md`, `CLAUDE.md`, `docs/process/new-feature.md`, `.claude/skills/planifier/SKILL.md`,
  `.claude/skills/verifier/verification-template.md`

- [ ] **Étape 1** : `docs/conventions/testing.md` (gabarit de `docs/README.md`, < 200 lignes) : exigence (ADR 0007),
      emplacement et nommage, imports depuis `vitest`, langue, requêtes par rôle ou texte, `user-event`,
      `renderWithProviders`, dates (fuseau UTC de la config, horloge figée), bug révélé (`it.skip` + dette), hors
      périmètre actuel (hooks de données). Fichiers clés : `vite.config.ts`, `src/test/setup.ts`,
      `src/test/renderWithProviders.tsx`, `src/utils/roles.test.ts`, `MatchLine.test.tsx`.
- [ ] **Étape 2** : entrée de sommaire dans `docs/conventions/README.md` (_À lire si_ : tu écris ou modifies une
      logique pure ou un test) ; dans `CLAUDE.md`, une règle non négociable « Tests » : test colocalisé obligatoire
      pour toute logique pure créée ou modifiée, détail dans `docs/conventions/testing.md`.
- [ ] **Étape 3** : `docs/process/new-feature.md` : en section 3, un test colocalisé pour toute logique pure créée ou
      modifiée ; en section 4, `npm test` passe.
- [ ] **Étape 4** : skill `planifier` : rappel que chaque tâche qui crée ou modifie une logique pure (`.utils`,
      `.reducer`, `src/utils/`) inclut son test, avec les noms de tests et les valeurs du brief. `verification-template.md` :
      remplacer « (pas encore de tests) » par un champ résultat.
- [ ] **Étape 5** : vérifier : chaque fichier touché < 200 lignes (`wc -l`), liens relatifs valides. Commit
      `docs: add testing conventions and test requirement`.

### Tâche 7 : workflow CI et procédure de PR

**Fichiers** :

- Créer : `.github/workflows/ci.yml`
- Modifier : `docs/process/pull-request.md`, `.github/pull_request_template.md`, `docs/tech-debt.md`

- [ ] **Étape 1** : `.github/workflows/ci.yml` : `name: CI` ; `on: pull_request: branches: [dev, main]` ;
      `concurrency` par ref avec `cancel-in-progress: true` ; un job `checks`, `name: Lint, build and test`,
      `runs-on: ubuntu-latest` ; étapes `actions/checkout`, `actions/setup-node` (`node-version-file: package.json`,
      `cache: npm`), `npm ci`, `npm run lint`, `npm run build`, `npm test`. Le nom de check exact est
      **`Lint, build and test`** (utilisé en tâche 8).
- [ ] **Étape 2** : `docs/process/pull-request.md` :
    - checklist : « `npm run lint`, `npm run build` et `npm test` passent » ;
    - courte section « CI » : le workflow, ce qu'il lance, le check `Lint, build and test` requis au merge ;
    - marche à suivre pour rendre un check obligatoire avec `gh api` (ruleset `Protect main`, ruleset `Protect dev`,
      règle `required_status_checks`), à faire seulement une fois le workflow présent dans la branche cible.
- [ ] **Étape 3** : `.github/pull_request_template.md` : `npm test` ajouté à la première case du plan de test.
- [ ] **Étape 4** : `docs/tech-debt.md`, section Outillage : retirer « Aucun test automatisé » et « Pas de CI ».
- [ ] **Étape 5** : vérifier : `ci.yml` valide (YAML lisible, `npx prettier --check .github/workflows/ci.yml`) ;
      `npm ci && npm run lint && npm run build && npm test` en local → exit 0 (même séquence que la CI) ;
      `vercel.json` et `lint-staged` inchangés (ni Vercel ni le pre-commit ne lancent les tests). L'exécution réelle
      sur GitHub et l'échec sur un test rouge se prouvent en phase Vérifier, une fois la PR ouverte.
- [ ] **Étape 6** : commit `ci: add github actions workflow for lint, build and tests`.

### Tâche 8 : rendre le check obligatoire (après le merge)

À mener **après le merge de la PR dans `dev`** (point de vigilance 5), pas pendant la phase Implémenter. Le journal la
note « à faire après le merge » ; le rapport de vérification marque le critère correspondant « non vérifiable avant
merge ».

**Fichiers** : aucun (réglages du dépôt `LeoGouchon/kicker-app`).

- [ ] **Étape 1** : vérifier que le check `Lint, build and test` a tourné au moins une fois
      (`gh pr checks <n°>` sur la PR mergée).
- [ ] **Étape 2** : montrer à l'utilisateur les deux changements et obtenir sa **confirmation explicite** :
    - ruleset existant `Protect main` (id `27496840`) : ajouter une règle `required_status_checks` avec le contexte
      `Lint, build and test`, en gardant `deletion`, `non_fast_forward` et `pull_request` ;
    - nouveau ruleset `Protect dev` (cible `refs/heads/dev`, `enforcement: active`) avec cette même règle.
- [ ] **Étape 3** : appliquer avec `gh api` (`PUT repos/LeoGouchon/kicker-app/rulesets/27496840` en renvoyant toutes
      les règles existantes, `POST repos/LeoGouchon/kicker-app/rulesets` pour `dev`).
- [ ] **Étape 4** : vérifier : `gh api repos/LeoGouchon/kicker-app/rulesets/<id>` → la règle
      `required_status_checks` contient `Lint, build and test` pour les deux rulesets.
