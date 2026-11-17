---
name: feature
description: Mène une feature de kicker-app de bout en bout en quatre phases (cadrer, planifier, implémenter, vérifier), chacune produisant un fichier dans specs/<feature>/ sur lequel s'appuie la suivante. À utiliser quand l'utilisateur démarre ou reprend une feature, une évolution significative, ou tape /feature.
argument-hint: '[description de la feature, ou rien pour reprendre]'
---

# Feature : le parcours complet

Tu orchestres quatre phases. Chacune produit **un fichier** dans `specs/<feature>/`, validé par l'utilisateur, et la
phase suivante travaille **à partir de ce fichier**, pas de la conversation. C'est ce qui permet de reprendre une
feature après une coupure de session ou depuis une autre machine.

| Phase          | Skill         | Lit                                     | Produit                    |
| -------------- | ------------- | --------------------------------------- | -------------------------- |
| 1. Cadrer      | `cadrer`      | la demande, le code, `docs/glossary.md` | `1-brief.md`               |
| 2. Planifier   | `planifier`   | `1-brief.md`                            | `2-plan.md`                |
| 3. Implémenter | `implementer` | `1-brief.md`, `2-plan.md`               | le code + `3-execution.md` |
| 4. Vérifier    | `verifier`    | les trois fichiers + le diff            | `4-verification.md`        |

Le rôle de `specs/` est décrit dans `specs/README.md`.

## 1. Trouver la feature

1. Lis la branche courante (`git branch --show-current`).
2. **Sur `dev` ou `main`** : c'est une nouvelle feature.
    - Propose un nom de branche `<type>/<kebab>` (voir `docs/conventions/git-workflow.md`) et fais-le valider.
    - Crée-la depuis `dev` à jour : `git switch dev && git pull && git switch -c <type>/<kebab>`.
    - Si l'utilisateur travaille dans un worktree Orca déjà créé sur la bonne branche, ne crée rien.
3. **Sur une branche de travail** : le dossier de la feature est `specs/<kebab>/`, où `<kebab>` est la partie après le
   `/` du nom de branche (`feat/match-filters` → `specs/match-filters/`).

## 2. Reprendre là où on en est

Regarde quels fichiers existent dans `specs/<kebab>/` et lis la ligne **Statut** de chacun, dans l'ordre :

- aucun fichier, ou `1-brief.md` pas `validé` → phase **Cadrer** ;
- `2-plan.md` absent ou pas `validé` → phase **Planifier** ;
- `3-execution.md` absent ou pas `terminé` → phase **Implémenter** (elle reprend à la première tâche non faite) ;
- `4-verification.md` absent ou pas `validé` → phase **Vérifier** ;
- tout est validé → la feature est prête pour la PR : suis `docs/process/pull-request.md`.

Annonce en une ligne où tu reprends et pourquoi (« Brief et plan validés, 3 tâches sur 7 faites : je reprends à la
tâche 4 »).

## 3. Enchaîner les phases

Pour chaque phase, appelle sa skill avec l'outil Skill (`cadrer`, `planifier`, `implementer`, `verifier`) et suis-la.

**Entre deux phases, tu t'arrêtes toujours.** Montre le fichier produit (lien et résumé de quelques lignes), puis
demande la validation explicite. Tant que l'utilisateur n'a pas validé :

- tu ne passes pas à la phase suivante ;
- tu corriges le fichier selon ses retours, puis tu redemandes.

À la validation :

1. passe la ligne **Statut** du fichier à `validé` (ou `terminé` pour `3-execution.md`) ;
2. commite le fichier seul : `docs(specs): add <phase> for <kebab>` (`brief`, `plan`, `execution report`,
   `verification report`) ;
3. rappelle que `git push` permet de reprendre depuis une autre machine. Ne pousse pas toi-même.

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
