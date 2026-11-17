---
name: feature
description: Mène une feature de kicker-app de bout en bout en quatre phases (cadrer, planifier, implémenter, vérifier), chacune produisant un fichier dans specs/<feature>/ sur lequel s'appuie la suivante. À utiliser quand l'utilisateur démarre ou reprend une feature, une évolution significative, ou tape /feature.
argument-hint: '[description de la feature, ou rien pour reprendre]'
---

# Feature : le parcours complet

Tu orchestres quatre phases. Chacune produit **un fichier** dans `specs/<feature>/`, validé par l'utilisateur, et la
phase suivante travaille **à partir de ce fichier**, pas de la conversation. C'est ce qui permet de reprendre une
feature après une coupure de session ou depuis une autre machine.

**Une session par phase.** Une session ne mène qu'une phase. La suivante démarre dans une session neuve, avec
`/feature`. Le contexte reste léger, et on est sûr que chaque phase part des fichiers produits, pas de la mémoire de
la conversation.

| Phase          | Skill         | Lit                                     | Produit                    |
| -------------- | ------------- | --------------------------------------- | -------------------------- |
| 1. Cadrer      | `cadrer`      | la demande, le code, `docs/glossary.md` | `1-brief.md`               |
| 2. Planifier   | `planifier`   | `1-brief.md`                            | `2-plan.md`                |
| 3. Implémenter | `implementer` | `1-brief.md`, `2-plan.md`               | le code + `3-execution.md` |
| 4. Vérifier    | `verifier`    | les trois fichiers + le diff            | `4-verification.md`        |

Le rôle de `specs/` est décrit dans `specs/README.md`.

## 1. Trouver la feature

1. Lis la branche courante (`git branch --show-current`) et lance `git fetch origin`.
2. **Branche au format `<type>/<kebab>`** (`type` parmi ceux de `docs/conventions/git-workflow.md`) : le dossier de
   la feature est `specs/<kebab>/` (`feat/match-filters` → `specs/match-filters/`). Passe à l'étape 2.
3. **Sur `dev` ou `main`** : c'est une nouvelle feature. Propose un nom `<type>/<kebab>`, fais-le valider, puis crée la
   branche depuis `origin/dev` : `git switch -c <type>/<kebab> origin/dev`. N'utilise pas `git switch dev` : il échoue
   quand `dev` est déjà extrait dans un autre worktree.
4. **Autre nom** (par exemple un worktree Orca, dont la branche s'appelle `<utilisateur>/<nom>`) : propose un nom
   `<type>/<kebab>`, fais-le valider, puis renomme la branche **avant tout fichier `specs/`** :
   `git branch -m <type>/<kebab>`. Si l'ancienne branche existe sur `origin`, ne touche pas au distant : signale-le,
   l'utilisateur décide.
5. Vérifie que la branche part de `dev` : `git merge-base --is-ancestor origin/dev HEAD`. Sinon (worktree créé depuis
   `main`, par exemple), propose `git rebase origin/dev` et ne le lance qu'avec l'accord de l'utilisateur.

Le nom de branche ne change plus ensuite : le dossier `specs/` en dépend.

## 2. Reprendre là où on en est

Regarde quels fichiers existent dans `specs/<kebab>/` et lis la ligne **Statut** de chacun, dans l'ordre :

- aucun fichier, ou `1-brief.md` pas `validé` → phase **Cadrer** ;
- `2-plan.md` absent ou pas `validé` → phase **Planifier** ;
- `3-execution.md` absent ou `en cours` → phase **Implémenter** (elle reprend à la première tâche non faite) ;
- `3-execution.md` `à valider` → toutes les tâches sont faites : montre le **Bilan** du journal et demande la
  validation (étape 3) ;
- `4-verification.md` absent ou pas `validé` → phase **Vérifier** ;
- tout est validé → la feature est prête pour la PR : suis `docs/process/pull-request.md`.

Annonce en une ligne où tu reprends et pourquoi (« Brief et plan validés, 3 tâches sur 7 faites : je reprends à la
tâche 4 »).

## 3. Mener la phase courante

Appelle la skill de la phase trouvée à l'étape 2 avec l'outil Skill (`cadrer`, `planifier`, `implementer`,
`verifier`) et suis-la. Elle lit ses entrées dans les fichiers de `specs/<kebab>/`, même si la conversation contient
déjà ces informations.

**À la fin de la phase, tu t'arrêtes toujours.** Montre le fichier produit (lien et résumé de quelques lignes), puis
demande la validation explicite. Tant que l'utilisateur n'a pas validé :

- tu ne passes pas à la phase suivante ;
- tu corriges le fichier selon ses retours, puis tu redemandes.

À la validation :

1. passe la ligne **Statut** du fichier à `validé` (ou `terminé` pour `3-execution.md`). Seule cette étape donne ce
   statut : une phase finit toujours en `brouillon` (ou `à valider`) ;
2. lance `git status` et commite le fichier de la phase **avec les autres fichiers qu'elle a modifiés** :
   `docs(specs): add <phase> for <kebab>` (`brief`, `plan`, `execution report`, `verification report`).
    - Cadrer : `docs/glossary.md`, les ADR créés et `docs/decisions/README.md`.
    - Planifier : `1-brief.md` s'il a été complété.
    - Vérifier : `docs/tech-debt.md` et la doc mise à jour. Les corrections de code ont déjà leurs propres commits.
    - Un changement qui n'appartient pas à la phase n'est pas commité : signale-le à l'utilisateur ;
3. rappelle que `git push` permet de reprendre depuis une autre machine. Ne pousse pas toi-même ;
4. **préviens l'utilisateur que la phase est finie et qu'il peut fermer cette session.** Indique la suite, par
   exemple : « Phase Planifier terminée et commitée. Tu peux fermer cette session (ou `/clear`), puis lancer
   `/feature` dans une nouvelle : elle reprendra à la phase Implémenter. »

N'enchaîne pas la phase suivante dans la même session. Si l'utilisateur demande explicitement de continuer ici,
rappelle-lui une fois l'intérêt d'une session neuve, puis fais ce qu'il décide.

Quand la phase **Vérifier** est validée, il n'y a plus de phase : indique que la feature est prête pour la PR
(`docs/process/pull-request.md`).

**Si la vérification bloque** (critère d'acceptation en échec, rôle mal géré dans la checklist de l'utilisateur,
correction trop large pour la phase Vérifier), la skill `verifier` rouvre l'implémentation (sa section 8) : tâches de
correction ajoutées au plan, journal repassé `en cours`, rapport en `bloqué`. Commite ces trois fichiers
(`docs(specs): reopen implementation for <kebab>`). Le prochain `/feature` reprend alors à la phase Implémenter, puis
refait la vérification. Si le problème remet en cause le brief, arrête-toi : l'utilisateur décide s'il faut recadrer.

## 4. Adapter la taille

- **Petite évolution** (un ou deux fichiers, aucune question ouverte) : le cadrage tient en un tour de questions et le
  brief en quelques lignes. On garde quand même les quatre fichiers : ils sont courts.
- **Correctif de bug** : le brief décrit le symptôme, la cause trouvée et le comportement attendu. Le plan commence par
  reproduire le bug.
- **Feature trop grosse** (plusieurs écrans indépendants, plus de ~400 lignes de diff prévues) : propose de la découper
  en plusieurs features, chacune avec sa branche et son dossier `specs/`.

## 5. Règles transverses

- Les règles de `CLAUDE.md` et de `docs/conventions/` s'appliquent à toutes les phases. En cas de conflit avec une
  skill, **la convention du projet l'emporte**.
- Les fichiers de `specs/` sont en français. Le code, les commentaires et les commits restent en anglais.
- Ne pousse jamais, ne merge jamais, n'ouvre pas de PR sans demande explicite.
