# Rapport de vérification : audit et mise à jour des dépendances

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md) · **Plan** : [2-plan.md](2-plan.md) · **Journal** : [3-execution.md](3-execution.md)
- **Commits vérifiés** : `origin/dev...e25e923` (implémentation jusqu'à `12cc26a`, puis les corrections de revue)

## Verdict

Prêt après la checklist ci-dessous : tous les critères d'acceptation sont validés en local ; seul le passage de la CI
reste à constater, une fois la branche poussée.

**Amendement du brief** (décidé par l'utilisateur en vérification) : la règle « dépendances d'exécution : une PR par
paquet » admet une exception, `react` et `react-dom` groupés (constat 1 de la revue).

## Preuves automatiques

Lancées le 2026-11-22 dans cette phase, sur l'arbre `node_modules` issu du `npm ci` de la tâche 4.

| Commande        | Résultat                                                                     |
| --------------- | ---------------------------------------------------------------------------- |
| `npm run lint`  | exit 0 : 0 erreur, 19 warnings (identique à la référence de la tâche 1)      |
| `npm run build` | exit 0 ; avertissement Vite « chunks > 500 kB », préexistant (voir plus bas) |
| `npm test`      | exit 0 : 6 fichiers, 59 tests passés, 2 ignorés                              |
| `npm audit`     | `found 0 vulnerabilities`                                                    |
| `npm ls`        | aucune ligne `invalid`, `missing`, `extraneous` ou `ERR`                     |

**Taille du bundle** (point laissé ouvert par le journal) : `origin/dev` construit à part (`git archive` + `npm ci` +
`npm run build`, hors du dépôt) donne déjà l'avertissement, avec un chunk unique de 1 840,70 kB (571,76 kB gzip).
La branche donne 1 858,07 kB (594,54 kB gzip), soit +17 kB (+1 %) et +23 kB gzip (+4 %). L'avertissement est
préexistant ; la hausse vient des nouvelles versions mineures (antd, TanStack Query, React Router…).

## Critères d'acceptation

| Critère du brief                                                              | Preuve                                                                                                                                                                                                                                                                                                                                    | Statut                    |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `npm audit` : 0 vulnérabilité                                                 | `npm audit` → `found 0 vulnerabilities`                                                                                                                                                                                                                                                                                                   | ok                        |
| `npm outdated` ne liste que des majeures, chacune dans `tech-debt.md`         | 13 lignes, toutes `Current` = `Wanted` et `Latest` majeur ; chacune couverte par une ligne de la section « Dépendances : versions majeures reportées » (FontAwesome : 5 paquets sur une ligne)                                                                                                                                            | ok                        |
| TypeScript en 5.9.x                                                           | `npx tsc --version` → `Version 5.9.3`                                                                                                                                                                                                                                                                                                     | ok                        |
| Versions minimales = versions installées                                      | script de contrôle du plan → aucune ligne                                                                                                                                                                                                                                                                                                 | ok                        |
| `@ant-design/plots` supprimé, ligne P3 retirée                                | absent de `package.json` ; `grep` ne le trouve plus que dans l'ADR 0004 (archive) ; ligne retirée de `tech-debt.md`                                                                                                                                                                                                                       | ok                        |
| Les deux plugins ESLint en `devDependencies`                                  | lecture de `package.json` : dans `devDependencies`, absents de `dependencies`                                                                                                                                                                                                                                                             | ok                        |
| lint, build et tests passent en local et en CI                                | local : voir Preuves automatiques. CI : la branche n'est pas poussée, `ci.yml` ne tourne que sur une PR vers `dev`/`main`                                                                                                                                                                                                                 | local ok, CI non vérifiée |
| `.github/dependabot.yml` conforme au brief                                    | relu clé par clé : `target-branch: dev`, npm et `github-actions` `weekly`, groupe `dev-dependencies` (`development`, minor + patch), production non groupée sauf `react` + `react-dom` (amendement), majeures npm ignorées (y compris la 0.5 de `eslint-plugin-react-refresh`, après correction), actions groupées, préfixe `chore(deps)` | ok                        |
| `docs/process/update-dependencies.md` : 7 sections, listée dans le sommaire   | titres : Fichiers clés, Quand mettre à jour, Auditer, Mineures et correctifs, Version majeure, Traiter une PR Dependabot, Règles ; entrée ligne 24 de `docs/process/README.md`                                                                                                                                                            | ok                        |
| `release.md` : case « `npm audit` sans vulnérabilité haute »                  | `docs/process/release.md:18`                                                                                                                                                                                                                                                                                                              | ok                        |
| `git-workflow.md` : exception `dependabot/...`                                | `docs/conventions/git-workflow.md:22`                                                                                                                                                                                                                                                                                                     | ok                        |
| `tech-debt.md` : majeures, alertes Dependabot, audit en CI, écrans sans tests | section « Dépendances : versions majeures reportées » (8 lignes) + 3 lignes dans « Outillage »                                                                                                                                                                                                                                            | ok                        |
| Historique en lots                                                            | `git log origin/dev..HEAD` : 5 commits `chore(deps)` dans l'ordre du brief (nettoyage, sécurité, exécution, outillage, Dependabot et doc), chacun avec ses seuls fichiers ; puis les commits de correction de la revue                                                                                                                    | ok                        |

**Règles métier** : aucune version majeure (`npm outdated` : `Current` = `Wanted` partout) ; `npm audit fix --force`
jamais utilisé (journal, tâche 2) ; aucune vulnérabilité restante à justifier ; commits séparés par lot (ci-dessus).
**États de l'interface** : sans objet, aucun fichier de `src/` modifié.

Après les corrections de revue : `npm run lint` → 0 erreur, 19 warnings ; `npm run build` → exit 0 ;
`npm test` → 59 passés, 2 ignorés.

## Revue de code

Sous-agent indépendant sur `git diff origin/dev...HEAD`, avec le brief, le plan, le journal et les 5 points de
vigilance. Chaque constat a été relu dans le code avant d'être accepté.

**Points de vigilance** : tous OK. (1) aucune plage remontée ni majeure par `npm audit fix` ; (2) Prettier signale
les mêmes 16 fichiers ; (3) les nouvelles dépréciations d'antd 6.7 (`clearIcon`, `suffixIcon` de Select, `more.*` de
Tabs…) ne sont pas utilisées dans `src/`, et axios 1.21 ne touche pas les intercepteurs de `src/auth/http.ts` ;
(4) aucun `@ts-expect-error` ni `eslint-disable` ; (5) `chore(deps)` produit bien `chore(deps): bump …`.

- **Corrigés** :
    1. **`react` et `react-dom` dans deux PR Dependabot séparées** : `react-dom` lève « Incompatible React versions »
       si sa version diffère de `react` (vérifié dans `node_modules/react-dom/cjs/react-dom-client.development.js`).
       Groupe `react` dans `.github/dependabot.yml`, exception notée dans la fiche. Commit
       `fix(deps): group react and react-dom in dependabot updates`. Preuve : YAML parsé, groupe présent ; Prettier ok.
    2. **`eslint-plugin-react-refresh` 0.5 non ignoré** : pour Dependabot, 0.4 → 0.5 est une mineure et serait entrée
       dans la PR groupée. Entrée `ignore` `version-update:semver-minor` pour ce paquet, phrase sur les paquets `0.x`
       dans la fiche. Seul paquet `0.x` concerné (`react-fontawesome` n'a pas de 0.3). Commit
       `fix(deps): ignore breaking 0.x minor of eslint-plugin-react-refresh`. Preuve : YAML parsé, deux entrées `ignore`.
    3. **Dépendances fantômes** (`@ant-design/icons`, `@rc-component/select`, préexistant) : ligne P3 dans
       `docs/tech-debt.md`.
    4. **Libellé de la release** : « `npm audit --audit-level=high` sort sans erreur (aucune vulnérabilité haute ou
       critique) » dans `release.md` et la fiche. Commit
       `docs(process): require no high or critical audit finding before release`.
    5. **TypeScript 6.0 déjà possible** (`typescript-eslint` 8.73 accepte `<6.1.0`, TypeScript 6.0.3 publié) : action
       de la ligne de dette mise à jour.
- **Non traités** : aucun.

## Parcours dans le navigateur

Hors périmètre par décision du brief (« Pas de parcours dans le navigateur ») : aucun écran modifié. Le risque des
montées d'antd, React et TanStack Query sans tests d'écran est noté en dette et un test de fumée est proposé dans la
checklist ci-dessous.

| Vérification                                        | Résultat                     |
| --------------------------------------------------- | ---------------------------- |
| Thème clair / sombre                                | non vérifié : hors périmètre |
| Largeur mobile                                      | non vérifié : hors périmètre |
| États chargement / vide / erreur                    | non vérifié : hors périmètre |
| Navigation (breadcrumb, menu, retour, rechargement) | non vérifié : hors périmètre |

## À faire par l'utilisateur

- [ ] **CI** : pousser la branche et ouvrir la PR vers `dev`, puis constater que le job « Lint, build and test » est
      vert (seul critère d'acceptation non vérifiable localement).
- [ ] **Rôles** : sans objet, aucune route ni aucun droit modifié.
- [ ] **Test de fumée recommandé** (hors critères) : `make dev`, se connecter, ouvrir le classement, un profil joueur
      et l'historique des matchs, ajouter un match ; vérifier l'absence d'erreur dans la console et le
      renouvellement du token après expiration (intercepteurs axios 1.19 → 1.21).

## Dette et documentation

- **Ajouté à `docs/tech-debt.md`** : la tâche 5 avait ajouté 8 lignes de versions majeures et 3 lignes d'outillage.
  En vérification : ligne P3 « dépendances fantômes » (constat 3), action de la ligne TypeScript (constat 5).
  Aucun raccourci `// shortcut:` dans le diff, aucun dans le journal.
- **Retiré de `docs/tech-debt.md`** : la ligne P3 `@ant-design/plots` (tâche 1).
- **Doc mise à jour** : contrôle de l'étape « Documenter » contre le diff : `overview.md` (TypeScript 5.9),
  `styling.md` (plots retiré), nouvelle fiche listée dans `docs/process/README.md`, `release.md`, `git-workflow.md`.
  Aucune variable d'environnement, aucun terme métier, aucune architecture changés. En vérification : fiche
  `update-dependencies.md` (groupe React, paquets `0.x`, niveau d'audit) et `release.md`. Tous les fichiers de `docs/`
  touchés sont sous 200 lignes (les plus longs : `tech-debt.md` 102, `update-dependencies.md` 97).
