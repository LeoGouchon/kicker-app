# Rapport de vérification : mise en place des tests automatisés et de la CI

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md) · **Plan** : [2-plan.md](2-plan.md) · **Journal** : [3-execution.md](3-execution.md)
- **Commits vérifiés** : `origin/dev...ee9c14c` (PR [#30](https://github.com/LeoGouchon/kicker-app/pull/30), brouillon)

## Verdict

Prêt pour la PR : tous les critères vérifiables avant le merge sont prouvés, y compris le check CI sur la PR #30. Les
trois constats de la revue sont corrigés. Il reste la tâche 8 (rulesets), à faire après le merge.

## Preuves automatiques

| Commande                                              | Résultat                                                                                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                        | exit 0, 0 erreur, 19 warnings (18 existants + 1 `quotes` dans `MatchLine.test.tsx`)                                  |
| `npm run build`                                       | exit 0 (avertissement existant de taille de chunk)                                                                   |
| `npm test`                                            | exit 0, `6 passed (6)` fichiers, `59 passed \| 2 skipped (61)`                                                       |
| `TZ=Asia/Tokyo npm test`                              | `59 passed \| 2 skipped (61)`                                                                                        |
| `TZ=America/Los_Angeles npm test`                     | `59 passed \| 2 skipped (61)`                                                                                        |
| `npm test` avec un test volontairement faux           | exit 1, `1 failed \| 58 passed \| 2 skipped` (ligne 12 de `roles.test.ts`, restaurée)                                |
| `npm run test:watch` puis modification d'un test      | `RERUN src/utils/roles.test.ts x1`, `21 passed (21)`, fichier restauré                                               |
| Relance après les corrections de revue (`53c2a49`)    | lint exit 0 (19 warnings), build exit 0, `59 passed \| 2 skipped (61)`                                               |
| Check `Lint, build and test` sur la PR #30            | `pass` en 1 min 19 s (run `44817486625`) : Node `24.x` lu dans `engines`, lint, build, `59 passed \| 2 skipped (61)` |
| Après `jsdom` 29 → 31 (`ee9c14c`, Node local 24.22.3) | lint exit 0 (19 warnings), build exit 0, `59 passed \| 2 skipped (61)` sous le fuseau local, Tokyo et Los Angeles    |

## Critères d'acceptation

| Critère du brief                                                        | Preuve                                                                                                                                                                                      | Statut                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `npm test` lance toute la suite, 0 échec hors tests en attente          | `npm test` → exit 0, 59 réussis, 2 `it.skip` qui renvoient chacun vers une ligne P1 de `docs/tech-debt.md`                                                                                  | ok                         |
| `npm run test:watch` relance en continu                                 | `vitest watch` : `RERUN src/utils/roles.test.ts` après modification                                                                                                                         | ok                         |
| Lint et build passent, tests compris                                    | lint 0 erreur, build exit 0 ; les tests sont dans `src/`, donc typés par `tsc -b` et lintés par `eslint .`                                                                                  | ok                         |
| Tests pilotes des cinq modules logiques                                 | `roles.test.ts`, `returnTo.test.ts`, `constructComplexPlayerFilter.test.ts`, `quarterChanges.test.ts`, `EnhancedTable.utils.test.tsx` : cas du brief présents                               | ok                         |
| Test `MatchLine` : 1v1, 2v2, score, noms, temps écoulé                  | `MatchLine.test.tsx`, 6 tests, horloge figée sur `2026-11-20T12:00:00Z` ; ordre des scores vérifié depuis la revue                                                                          | ok                         |
| Indépendant du fuseau horaire                                           | même résultat sous le fuseau local, `Asia/Tokyo` et `America/Los_Angeles` (et `Pacific/Kiritimati` par le relecteur)                                                                        | ok                         |
| Helper de rendu avec providers                                          | `src/test/renderWithProviders.tsx` : `QueryClient`, `MemoryRouter`, `ThemeProvider`, `user`                                                                                                 | ok                         |
| Conventions des tests                                                   | les 6 fichiers importent depuis `vitest` (pas de `globals`), descriptions en anglais, aucun `data-testid` ni `querySelector`, fichiers colocalisés                                          | ok                         |
| Workflow CI sur une PR vers `dev`, échoue si lint, build ou test échoue | check `Lint, build and test` au vert sur la PR #30 vers `dev`. Échec : chaque commande est une étape `run` (arrêt sur code non nul), et un test faux fait sortir `npm test` en 1 (en local) | ok                         |
| Pre-commit et Vercel ne lancent pas les tests                           | `vercel.json` et bloc `lint-staged` identiques à `origin/dev` ; sur la PR, le build Vercel est ignoré (`Ignored Build Step`)                                                                | ok                         |
| Code applicatif non modifié                                             | `git diff --name-only origin/dev...HEAD -- src` : uniquement des `*.test.ts(x)` et `src/test/`                                                                                              | ok                         |
| Doc à jour                                                              | voir « Dette et documentation »                                                                                                                                                             | ok                         |
| Check requis au merge sur `main` et `dev`                               | tâche 8, après le merge                                                                                                                                                                     | non vérifiable avant merge |

**Règles métier** : bug révélé → `it.skip` + `// Pending: docs/tech-debt.md, "…"` + ligne P1, sans correction (2 cas,
`returnTo.test.ts:28` et `quarterChanges.test.ts:38`) ; issue GitHub écartée par l'utilisateur (journal, Décisions).
Dates maîtrisées : `env: { TZ: 'UTC' }` dans `vite.config.ts`, horloge figée dans `MatchLine.test.tsx`.

## Revue de code

Relecteur indépendant (sous-agent à contexte neuf) : « Verdict : prêt ». Les cinq points de vigilance du plan sont
confirmés. Chaque constat a été relu dans le code. Aucun constat « À corriger » ; l'utilisateur a choisi de corriger les
trois autres.

- **Corrigés** :
    1. **À améliorer**, `52f572d` `test(duo): check table boundaries per metric`. `buildRow` donnait la même valeur aux
       sept métriques : un code qui lisait toujours `record.matches` passait le test des bornes. Chaque métrique a
       maintenant sa plage. Preuve : avec `record.matches.value` à la ligne 110 d'`EnhancedTable.utils.tsx`, le test
       échoue (`1 failed | 10 passed`) ; source restaurée.
    2. **À améliorer**, `ce33352` `test(match-line): check score order between teams`. `getByText('10')` et
       `getByText('7')` passaient avec des scores inversés. Le test vérifie maintenant `10 vs 7` dans l'ordre. Preuve :
       avec `scoreB` à la place de `scoreA` dans `MatchLine.tsx`, le test échoue (`1 failed | 5 passed`) ; source
       restaurée.
    3. **Optionnel**, `53c2a49` `docs(process): …`. `pull-request.md` présentait le check comme déjà requis au merge ;
       il le sera une fois le ruleset de la branche cible à jour (tâche 8).
- **Traité dans cette phase** : le conflit ESLint `quotes` / Prettier est ajouté à la dette (constat 4, déjà prévu par
  le journal).
- **Constat de la CI** : le log du run montre un warning React (`textAlign` non reconnu sur un élément du DOM) pendant
  les tests de `MatchLine`. Il vient du code existant (`MatchPlayers` transmet sa prop de style au DOM), pas de la
  feature. Ajouté en P3 de la dette.

## Parcours dans le navigateur

Sans objet : aucun écran, composant ni fichier applicatif modifié (seuls des tests, la config de test, la CI et la doc
changent). Le build de production passe à l'identique.

| Vérification                                        | Résultat                    |
| --------------------------------------------------- | --------------------------- |
| Thème clair / sombre                                | sans objet (aucun écran)    |
| Largeur mobile                                      | sans objet (aucun écran)    |
| États chargement / vide / erreur                    | sans objet (aucune requête) |
| Navigation (breadcrumb, menu, retour, rechargement) | sans objet (aucune route)   |

## À faire par l'utilisateur

- [ ] Relire la PR #30 (brouillon), la passer en « prête » et la merger quand tout est validé.
- [ ] Après le merge : tâche 8 du plan (check requis dans `Protect main` et nouveau `Protect dev`), avec confirmation
      explicite avant toute modification des rulesets.

## Dette et documentation

- **Ajouté à `docs/tech-debt.md`** :
    - en implémentation (P1) : `getReturnTo` accepte `/\evil.com` ; `getQuarterChanges` ignore l'année ;
    - dans cette phase (Outillage) : conflit ESLint `quotes` / Prettier ;
    - dans cette phase (P3) : prop `textAlign` de `MatchPlayers` transmise au DOM.
- **Raccourcis** : aucun `// shortcut:` dans le diff, aucun dans le journal.
- **Retiré de `docs/tech-debt.md`** : « Aucun test automatisé » et « Pas de CI » (Outillage), en tâche 7. `jsdom` est monté en 31
  dans cette phase (`ee9c14c`, après la mise à jour du Node local) : la décision de la tâche 1 n'a plus lieu d'être
  et n'entre pas dans la dette.
- **Hors périmètre, signalé** : `npm audit` remonte des vulnérabilités dans des dépendances antérieures à la branche
  (`axios`, `follow-redirects`, `js-yaml`, `brace-expansion`, `minimatch`, `@humanfs/node`). Aucune ne vient des
  dépendances de test ajoutées ici.
- **Doc mise à jour** (contrôlée contre le diff) : ADR 0007 et sommaire des ADR ; `conventions/testing.md` (121 lignes)
  et son entrée de sommaire ; `CLAUDE.md` (commandes, règle « Tests », phrase « pas de tests » retirée) ;
  `getting-started.md` (Node 24, commandes) ; `process/pull-request.md` (checklist, section CI, check obligatoire,
  précisé après la revue) ; `process/new-feature.md` (étape Tests, `npm test`) ; modèle de PR ; skill `planifier` ;
  modèle de rapport `verifier`.
