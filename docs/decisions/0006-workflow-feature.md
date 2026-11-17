# 0006. Workflow feature en quatre phases avec Claude Code

- **Statut** : Proposé
- **Date** : 2026-11-17

## Contexte

`docs/process/new-feature.md` donne la checklist d'une feature, mais avec Claude Code rien ne garantit que :

- le besoin est construit **avec** le développeur, par allers-retours, avant d'écrire du code ;
- le plan est écrit et validé, puis conservé ;
- la vérification apporte des preuves plutôt que des affirmations.

Le mode plan ne garde le plan que dans la conversation : il est perdu à la fin de la session et ne suit pas d'une
machine à l'autre. Le projet n'a pas encore de tests automatisés, ce qui pèse sur le choix d'un outil.

## Options envisagées

1. **Plugin superpowers** (obra) : workflow complet et éprouvé. Mais il impose le TDD (le code écrit avant son test est
   supprimé) alors que le projet n'a aucun test. Il écrit dans `docs/superpowers/`, ce qui casse la structure de
   `docs/`, et gère ses propres worktrees, en doublon avec Orca.
2. **Plugin feature-dev** (Anthropic) : léger, avec questions de clarification et revue par agents. Mais le plan reste
   dans la conversation et la vérification se limite à une revue de code.
3. **Plugin mattpocock-skills** : excellent pour le cadrage (`grill-me`, glossaire, ADR). Mais il publie les specs dans
   un outil de tickets et centre l'implémentation sur le TDD.
4. **GSD, GSTACK** : frameworks complets, trop lourds pour une SPA de cette taille.
5. **Skills projet adaptées de ces plugins** (licence MIT), versionnées dans `.claude/skills/`.

## Décision

Nous retenons l'option 5. Quatre skills projet, lancées par `/feature`, chacune produisant un fichier dans
`specs/<feature>/` sur lequel s'appuie la suivante :

| Phase       | Skill         | Inspirée de                                                                        | Produit                                    |
| ----------- | ------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| Cadrer      | `cadrer`      | `grilling`, `domain-modeling` (mattpocock)                                         | `1-brief.md`, glossaire et ADR à jour      |
| Planifier   | `planifier`   | `writing-plans` (superpowers)                                                      | `2-plan.md`                                |
| Implémenter | `implementer` | `executing-plans` (superpowers), `ponytail`                                        | code, `3-execution.md`                     |
| Vérifier    | `verifier`    | `verification-before-completion` (superpowers), `ponytail-review`, `ponytail-debt` | `4-verification.md`, `tech-debt.md` à jour |

- **Specs dans le dépôt** : les fichiers de `specs/` sont commités dans la branche de la feature. Une issue GitHub a été
  écartée : un fichier se relit dans le diff de la PR et l'agent le modifie facilement. Un dossier local non versionné
  a aussi été écarté : il ne suit pas d'une machine à l'autre.
- **Hors de `docs/`** : une spec date d'un moment donné, alors que `docs/` décrit l'état actuel.
- **Glossaire** : `docs/glossary.md` fait le pont entre le vocabulaire de l'interface (français) et celui du code
  (anglais). Le cadrage le lit et le complète.
- **Vérification de l'interface** : l'agent parcourt l'app dans le navigateur (Orca ou Chrome). Les tests par rôle
  restent au développeur, car ils demandent des comptes OIDC distincts.
- **Adapter plutôt qu'installer** : les skills tiennent compte des conventions du projet, n'ajoutent aucune dépendance
  pour l'équipe et ne s'activent pas dans les autres projets.

## Conséquences

- **Positives** :
    - le besoin est validé avant le plan, le plan avant le code ;
    - une feature se reprend après une coupure ou depuis une autre machine ;
    - chaque PR arrive avec son besoin, son plan et ses preuves.
- **Négatives / coûts** :
    - quatre fichiers par feature, même petite (ils restent courts) ;
    - les skills adaptées ne suivent plus les évolutions des plugins d'origine ; à revoir de temps en temps ;
    - le parcours dans le navigateur dépend d'un outil disponible sur la machine (Orca ou Claude in Chrome).
- **Suivi** :
    - la mise en place des tests automatisés sera la première feature menée avec ce workflow, avec son propre ADR ;
    - quand les tests existeront, `planifier` et `verifier` les intègrent déjà (`npm test` s'il existe) ; le niveau
      de détail (TDD ou non) sera fixé par l'ADR des tests ;
    - les termes _À confirmer_ du glossaire se valident au fil des cadrages.
