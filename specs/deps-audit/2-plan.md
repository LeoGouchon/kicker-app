# Plan : audit et mise à jour des dépendances

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md)
- **Exécution** : dans la conversation (5 tâches)

**Objectif** : ramener `npm audit` à 0 vulnérabilité, rattraper toutes les versions mineures et correctives, puis
outiller la suite (Dependabot, fiche de process, dette).

**Approche** : une tâche par lot de commit imposé par le brief, dans l'ordre du brief. Chaque lot passe par `npm`
(jamais d'édition à la main du lockfile), puis par le même filet : lint, build, tests. La doc touchée par un lot
(versions citées, `@ant-design/plots`) est mise à jour dans ce lot ; la doc nouvelle va dans le lot 5.

## Contraintes globales

- **Aucune version majeure.** Les versions cibles sont la colonne **Wanted** de `npm outdated` au moment de la tâche,
  sauf TypeScript, forcé en `~5.9.3`. Relevé du 2026-11-22 dans chaque tâche, à titre indicatif.
- **Jamais `npm audit fix --force`.**
- **Versions minimales = versions installées** : un `^x.y.z` dans `package.json` vaut la version de `npm ls --depth=0`.
  TypeScript garde le `~` (déjà le cas). Contrôle, à lancer à la fin des tâches 3 et 4 :

    ```bash
    node -e "const p=require('./package.json');const l=require('./package-lock.json').packages;for(const d of ['dependencies','devDependencies'])for(const[n,r]of Object.entries(p[d]))if(r.replace(/^[~^]/,'')!==l['node_modules/'+n].version)console.log(d,n,r,'≠',l['node_modules/'+n].version)"
    ```

    → aucune ligne affichée.

- **Filet de chaque tâche** : `npm run lint` → 0 erreur et pas plus de **19 warnings** (référence du 2026-11-22),
  `npm run build` → exit 0, `npm test` → tout vert, `npm ls --depth=0` → aucune ligne `invalid`, `missing` ou `ERR`.
- **Un warning ou une erreur nouvelle causée par une mise à jour** se corrige dans la tâche qui l'a introduite, avec le
  changement minimal et en respectant `CLAUDE.md`. Les warnings existants ne se corrigent pas (hors périmètre).
- **Commits** : un par tâche, type `chore(deps)` (`docs/conventions/git-workflow.md` : dépendances = `chore`). Le
  hook de pre-commit n'est jamais contourné.
- **Doc** : en français, 200 lignes visées par fichier, chaque nouveau fichier listé dans le `README.md` de son dossier.

## Points de vigilance

1. `npm audit fix` remonte une plage de `package.json` ou passe une version majeure → `git diff package.json` vide
   après la commande, et `npm outdated` ne montre aucun `Current` au-delà de `Wanted` (vérifié en tâche 2).
2. Prettier 3.6 → 3.10 change le formatage → `npx prettier --check .` avant et après la montée ; seuls les fichiers
   déjà signalés avant ont le droit d'apparaître. Sinon, noter l'écart dans le journal sans reformater le dépôt
   (vérifié en tâche 4).
3. antd 6.7 ou React 19.3 émettent de nouveaux avertissements de dépréciation : faute de parcours navigateur, la
   sortie de `npm test` est le seul signal → comparer les `Warning:` / `deprecated` de la sortie avant et après, et
   reporter les nouveaux dans le journal (vérifié en tâche 3).
4. TypeScript 5.9 ou `typescript-eslint` 8.73 rendent le build ou le lint plus stricts → erreurs corrigées dans la
   tâche 4, pas de `@ts-expect-error` ni d'`eslint-disable` ajouté.
5. Le préfixe `chore(deps)` de Dependabot doit produire `chore(deps): bump …` (et pas `chore(deps)bump` ni
   `chore(deps-dev)`) → relire la doc GitHub de `commit-message` avant de valider le fichier (vérifié en tâche 5).
   Dependabot ne lit sa configuration que sur `main` : aucune vérification en conditions réelles avant la release.

## Carte des fichiers

| Fichier                               | Action    | Responsabilité                                                     |
| ------------------------------------- | --------- | ------------------------------------------------------------------ |
| `package.json`                        | modifier  | dépendances, plages minimales                                      |
| `package-lock.json`                   | régénérer | arbre installé (uniquement via `npm`)                              |
| `docs/architecture/styling.md`        | modifier  | retirer la mention de `@ant-design/plots`                          |
| `docs/architecture/overview.md`       | modifier  | stack : TypeScript 5.9                                             |
| `.github/dependabot.yml`              | créer     | configuration Dependabot (npm + GitHub Actions)                    |
| `docs/process/update-dependencies.md` | créer     | fiche « mettre à jour les dépendances »                            |
| `docs/process/README.md`              | modifier  | entrée de sommaire pour la fiche                                   |
| `docs/process/release.md`             | modifier  | case « `npm audit` sans vulnérabilité haute »                      |
| `docs/conventions/git-workflow.md`    | modifier  | exception des branches `dependabot/...`                            |
| `docs/tech-debt.md`                   | modifier  | retrait de la ligne `@ant-design/plots`, ajout des lignes du brief |

Aucun fichier de `src/` n'est prévu. Seules exceptions : les corrections minimales imposées par les points de
vigilance 3 et 4, notées dans le journal. Diff manuel estimé : ~200 lignes hors lockfile et `specs/`.

---

### Tâche 1 : nettoyage de `package.json`

**Fichiers** :

- Modifier : `package.json`, `package-lock.json`, `docs/tech-debt.md`, `docs/architecture/styling.md`

**Interfaces** :

- Fournit : la référence du lint (19 warnings) et de `npx prettier --check .` (liste des fichiers signalés), notées
  dans le journal pour les tâches 3 et 4.

- [ ] **Étape 1** : relever la référence : `npm run lint` (compte des warnings), `npx prettier --check .` (fichiers
      signalés) et `npm test 2>&1` (lignes contenant `Warning` ou `deprecated`). Les noter dans `3-execution.md`.
- [ ] **Étape 2** : `npm uninstall @ant-design/plots`.
- [ ] **Étape 3** : déplacer les deux plugins sans changer leur version :
      `npm install -D eslint-plugin-simple-import-sort@^12.1.1 eslint-plugin-unused-imports@^4.1.4`. Vérifier qu'ils
      ne sont plus dans `dependencies`.
- [ ] **Étape 4** : `docs/tech-debt.md` : supprimer la ligne P3 « Dépendance `@ant-design/plots` jamais importée ».
      `docs/architecture/styling.md` (section Graphiques) : supprimer la ligne « `@ant-design/plots` est une
      dépendance mais n'est importé nulle part ». L'ADR 0004 n'est pas modifié (archive).
- [ ] **Étape 5** : vérifier : `grep -rn "ant-design/plots" src docs package.json` → seule l'ADR 0004 ressort ;
      filet complet (contraintes globales).
- [ ] **Étape 6** : commit `chore(deps): remove unused plots and move eslint plugins to dev dependencies`.

### Tâche 2 : correctifs de sécurité

**Fichiers** :

- Modifier : `package-lock.json`

- [ ] **Étape 1** : `npm audit` : noter le nombre de vulnérabilités dans le journal (14 attendues : 6 hautes,
      8 modérées ; axios, Vite, `typescript-eslint`, `source-map-js`…).
- [ ] **Étape 2** : `npm audit fix` (sans `--force`).
- [ ] **Étape 3** : vérifier :
    - `npm audit` → `found 0 vulnerabilities` ;
    - `git diff --stat` → seul `package-lock.json` a changé (point de vigilance 1) ;
    - filet complet.
- [ ] **Étape 4** : s'il reste une vulnérabilité qui exige une version majeure, ne pas la forcer : la noter dans le
      journal (paquet, avis, version qui corrige) pour la tâche 5 (ligne de dette) et le rapport de vérification.
- [ ] **Étape 5** : commit `chore(deps): fix npm audit vulnerabilities`.

### Tâche 3 : bibliothèques d'exécution

**Fichiers** :

- Modifier : `package.json`, `package-lock.json` ; `src/...` seulement si le filet l'exige (point de vigilance 3)

**Interfaces** :

- Utilise : la référence du lint et des warnings de tests (tâche 1).

- [ ] **Étape 1** : relancer `npm outdated` et prendre la colonne **Wanted**. Monter **toutes** les entrées de
      `dependencies` en une commande `npm install <paquet>@^<wanted> …`, plus `@types/react` et `@types/react-dom`
      (`-D`), qui suivent la version de React. Relevé du 2026-11-22 :
      `@tanstack/react-query 5.108.2`, `antd 6.7.1`, `axios 1.21.1`, `chart.js 4.6.1`, `dayjs 1.11.23`,
      `react 19.3.1`, `react-dom 19.3.1`, `react-chartjs-2 5.3.1`, `react-router-dom 7.18.6`,
      `@fortawesome/react-fontawesome 0.2.6`, `@types/react 19.3.0`, `@types/react-dom 19.3.0`.
- [ ] **Étape 2** : remonter aussi les plages des dépendances d'exécution déjà à jour mais dont la plage est en
      retard, repérées par le script de contrôle des contraintes globales (ex. `@emotion/*`,
      `chartjs-plugin-annotation`, `oidc-client-ts`) : `npm install <paquet>@^<version installée>`. Les paquets
      FontAwesome 6 (`^6.7.2`) sont déjà alignés et restent en 6.
- [ ] **Étape 3** : vérifier :
    - le script de contrôle des contraintes globales → aucune ligne de `dependencies` ;
    - `npm outdated` → plus aucune entrée de `dependencies` dont `Current` < `Wanted` ;
    - filet complet ;
    - sortie de `npm test 2>&1` : pas de nouveau `Warning` / `deprecated` par rapport à la tâche 1. Sinon, le noter
      dans le journal (paquet, message, fichier) et le corriger si c'est une dépréciation d'API antd ou React sur
      du code existant.
- [ ] **Étape 4** : `npm audit` → 0 vulnérabilité (une nouvelle version peut en apporter une).
- [ ] **Étape 5** : commit `chore(deps): update runtime dependencies to latest minor`.

### Tâche 4 : outillage et TypeScript 5.9

**Fichiers** :

- Modifier : `package.json`, `package-lock.json`, `docs/architecture/overview.md` ; `src/...` ou
  `eslint.config.js` seulement si le filet l'exige (point de vigilance 4)

**Interfaces** :

- Utilise : la référence du lint et de Prettier (tâche 1).

- [ ] **Étape 1** : relancer `npm outdated`, puis `npm install -D <paquet>@^<wanted> …` pour toutes les entrées
      restantes de `devDependencies`, et `typescript@~5.9.3`. Relevé du 2026-11-22 : `eslint 9.39.5`,
      `@eslint/js 9.39.5`, `typescript-eslint 8.73.0` (accepte TypeScript `<6.1.0`), `vite 8.3.8`,
      `@vitejs/plugin-react 6.3.0`, `prettier 3.10.1`, `globals 16.5.0`, `lint-staged 16.4.0`,
      `eslint-plugin-react-refresh 0.4.26`, `eslint-plugin-unused-imports 4.4.1`.
- [ ] **Étape 2** : remonter les plages des `devDependencies` déjà à jour (`vitest`, `jsdom`, `@testing-library/*`,
      `husky`, `eslint-config-prettier`, `eslint-plugin-react-hooks`, `eslint-plugin-simple-import-sort`) à leur
      version installée.
- [ ] **Étape 3** : `docs/architecture/overview.md`, tableau Stack : `TypeScript 5.8 (strict)` →
      `TypeScript 5.9 (strict)`.
- [ ] **Étape 4** : vérifier :
    - `npx tsc --version` → `Version 5.9.x` ;
    - le script de contrôle des contraintes globales → aucune ligne ;
    - `npm outdated` → uniquement des lignes où `Wanted` = `Current` et `Latest` est une version majeure, soit
      exactement la liste du brief (ESLint et `@eslint/js` 10, TypeScript 7, FontAwesome 7 et `react-fontawesome` 3,
      `eslint-plugin-react-hooks` 7, `globals` 17, `lint-staged` 17, `eslint-plugin-simple-import-sort` 14,
      `eslint-plugin-react-refresh` 0.5). Toute autre ligne est notée dans le journal pour la tâche 5 ;
    - `npx prettier --check .` → pas de nouveau fichier signalé (point de vigilance 2) ;
    - `npm audit` → 0 vulnérabilité ;
    - `rm -rf node_modules && npm ci` puis le filet complet (même chemin que la CI). Le passage de la CI elle-même
      se constate à la phase Vérifier, une fois la branche poussée.
- [ ] **Étape 5** : commit `chore(deps): update tooling to latest minor and typescript 5.9`.

### Tâche 5 : Dependabot et documentation

**Fichiers** :

- Créer : `.github/dependabot.yml`, `docs/process/update-dependencies.md`
- Modifier : `docs/process/README.md`, `docs/process/release.md`, `docs/conventions/git-workflow.md`,
  `docs/tech-debt.md`

**Interfaces** :

- Utilise : les versions majeures restantes (tâche 4) et les éventuelles vulnérabilités non corrigées (tâche 2).

- [ ] **Étape 1** : `.github/dependabot.yml`, `version: 2`, deux entrées `updates` :
    - `npm`, `directory: /`, `target-branch: dev`, `schedule.interval: weekly`,
      `commit-message.prefix: chore(deps)` (et `prefix-development: chore(deps)`) ;
      `ignore` : `dependency-name: '*'` avec `update-types: ['version-update:semver-major']` ;
      `groups.dev-dependencies` : `dependency-type: development`, `update-types: [minor, patch]`.
      Pas de groupe pour la production : une PR par paquet ;
    - `github-actions`, `directory: /`, `target-branch: dev`, `schedule.interval: weekly`,
      `commit-message.prefix: chore(deps)`, `groups.github-actions.patterns: ['*']`.
- [ ] **Étape 2** : vérifier le fichier : `npx prettier --check .github/dependabot.yml` → OK, et relecture clé par
      clé contre la doc GitHub « Dependabot options reference » (point de vigilance 5).
- [ ] **Étape 3** : `docs/process/update-dependencies.md`, gabarit de `docs/README.md` (titre, phrase de résumé,
      **Fichiers clés**), avec les sections du brief dans cet ordre :
    - **Fichiers clés** : `package.json`, `package-lock.json`, `.github/dependabot.yml`, `docs/tech-debt.md` ;
    - **Quand mettre à jour** : PR Dependabot hebdomadaires ; avant une release (`npm audit`) ; à l'annonce d'une
      faille ;
    - **Auditer** : `npm audit`, `npm outdated` (lire `Wanted` vs `Latest`) ;
    - **Mineures et correctifs** : `npm install <paquet>@^<version>`, plage minimale = version installée, filet
      lint / build / test, une bibliothèque d'exécution par PR tant que les écrans n'ont pas de tests ;
    - **Version majeure** : une PR par paquet, lire le guide de migration, retirer la ligne de `tech-debt.md` ;
      cas de TypeScript bloqué par la plage de `typescript-eslint` ;
    - **Traiter une PR Dependabot** : CI verte, lire le changelog, tester localement pour une bibliothèque
      d'exécution, squash merge (le titre est déjà au format `chore(deps): …`) ; démarrage après la première
      release qui porte le fichier sur `main` ;
    - **Règles** : jamais `npm audit fix --force`, jamais d'édition à la main du lockfile, pas de version majeure
      mêlée à des mineures, toujours `npm ci` en CI.

    Moins de 200 lignes.

- [ ] **Étape 4** : `docs/process/README.md` : entrée
      `- [update-dependencies.md](update-dependencies.md) : auditer et mettre à jour les dépendances, versions majeures, PR Dependabot.`
      avec _À lire si_ : « tu traites une PR Dependabot, une alerte `npm audit` ou une montée de version ».
- [ ] **Étape 5** : `docs/process/release.md`, section Préparer, après la case `npm ci && npm run lint && npm run build` :
      `- [ ] \`npm audit\` sans vulnérabilité haute.`
- [ ] **Étape 6** : `docs/conventions/git-workflow.md`, tableau Branches : ligne `dependabot/...` | « PR automatiques
      de Dependabot » | « Créées par Dependabot vers `dev`, hors format `<type>/<kebab>`. Titre déjà au format
      `chore(deps): …` ».
- [ ] **Étape 7** : `docs/tech-debt.md` :
    - nouvelle section `## Dépendances : versions majeures reportées`, tableau `Paquet | Version installée → disponible | Action`,
      une ligne par élément de la liste du brief : ESLint et `@eslint/js` 10 ; TypeScript 7 (bloqué par
      `typescript-eslint`, qui n'accepte pas au-delà de 6.0) ; FontAwesome 7 et `react-fontawesome` 3 ;
      `eslint-plugin-react-hooks` 7 (règles React Compiler) ; `globals` 17 ; `lint-staged` 17 ;
      `eslint-plugin-simple-import-sort` 14 ; `eslint-plugin-react-refresh` 0.5. Versions prises dans le
      `npm outdated` de la tâche 4, plus toute ligne supplémentaire qu'il a montrée ;
    - section Outillage, trois lignes : alertes et correctifs de sécurité Dependabot à activer dans les Settings
      GitHub ; `npm audit` absent de la CI ; écrans sans tests (aucun filet pour les montées de bibliothèques
      d'exécution) ;
    - une ligne par vulnérabilité restante notée en tâche 2, le cas échéant ;
    - mettre à jour la date du relevé si le fichier en porte une pour la section.
- [ ] **Étape 8** : vérifier : `npx prettier --check .github docs` → OK ; `wc -l` des fichiers de `docs/` modifiés
      → 200 lignes ou moins ; `npm run lint` et `npm run build` → inchangés.
- [ ] **Étape 9** : commit `chore(deps): add dependabot config and dependency update process`.
