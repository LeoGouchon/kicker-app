# Specs

Le dossier de travail de chaque feature menée avec le workflow `/feature` : le besoin validé, le plan, le journal
d'exécution et le rapport de vérification. Le pourquoi de ce workflow est dans
[l'ADR 0006](../docs/decisions/0006-workflow-feature.md).

## Différence avec `docs/`

- `docs/` décrit ce qui **est** et ce qui **doit être** aujourd'hui. Il est tenu à jour.
- `specs/` garde ce qui a été **décidé et fait** pour une feature, à un moment donné. On ne le met pas à jour après le
  merge : c'est une archive. Si une spec contredit `docs/` ou le code, c'est `docs/` et le code qui font foi.

Les règles de `docs/` (200 lignes visées, sommaire par dossier) ne s'appliquent pas ici.

## Organisation

Un dossier par feature, nommé comme la partie kebab de sa branche (`feat/match-filters` → `specs/match-filters/`) :

| Fichier             | Phase       | Produit par         | Contenu                                                                     |
| ------------------- | ----------- | ------------------- | --------------------------------------------------------------------------- |
| `1-brief.md`        | Cadrer      | skill `cadrer`      | besoin, rôles, règles, critères d'acceptation, hors périmètre               |
| `2-plan.md`         | Planifier   | skill `planifier`   | carte des fichiers, tâches vérifiables, points de vigilance                 |
| `3-execution.md`    | Implémenter | skill `implementer` | journal : tâches faites, décisions prises, raccourcis laissés               |
| `4-verification.md` | Vérifier    | skill `verifier`    | preuves, critères vérifiés, revue, parcours navigateur, checklist des rôles |

Chaque phase s'appuie sur le fichier précédent, et chaque fichier porte une ligne **Statut**. La skill `feature` lit
ces statuts pour reprendre là où on s'était arrêté.

Chaque phase se mène dans **sa propre session** : une fois la phase validée et commitée, on ferme la session et on
relance `/feature` dans une nouvelle. La phase suivante ne connaît donc que les fichiers, ce qui garantit qu'ils
suffisent à eux seuls.

## Reprendre depuis une autre machine

Chaque fichier est commité dans la branche à la fin de sa phase, avec les fichiers de `docs/` que la phase a modifiés
(glossaire, ADR, dette). Il suffit de pousser la branche, de la récupérer ailleurs, puis de relancer `/feature` : elle
repart de la première phase non validée.

## Statuts

- **Brief, plan** : `brouillon` → `validé`.
- **Journal** : `en cours` → `à valider` (toutes les tâches faites) → `terminé`.
- **Rapport** : `brouillon` → `validé`, ou `bloqué` si la vérification rouvre l'implémentation : des tâches de
  correction sont ajoutées au plan et le journal repasse `en cours`.

Seule la validation de l'utilisateur, dans la skill `feature`, donne `validé` ou `terminé`.

## Après le merge

Les fichiers restent dans `dev` (le squash merge les inclut) : ils documentent la PR et servent de référence quand on
revient sur la feature. Les gabarits sont dans `.claude/skills/<phase>/`.
