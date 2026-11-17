# Rapport de vérification : <titre de la feature>

- **Statut** : brouillon (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md) · **Plan** : [2-plan.md](2-plan.md) · **Journal** : [3-execution.md](3-execution.md)
- **Commits vérifiés** : `origin/dev...<sha fin>`

## Verdict

Prêt pour la PR | Prêt après la checklist ci-dessous | Bloqué : <raison>

## Preuves automatiques

| Commande        | Résultat              |
| --------------- | --------------------- |
| `npm run lint`  |                       |
| `npm run build` |                       |
| `npm test`      | (pas encore de tests) |

## Critères d'acceptation

| Critère du brief | Preuve | Statut                   |
| ---------------- | ------ | ------------------------ |
|                  |        | ok / non vérifié / échec |

## Revue de code

- **Corrigés** : constats traités, avec la preuve.
- **Non traités** : constats laissés à la décision de l'utilisateur (reportés dans `docs/tech-debt.md` s'il les
  écarte).

## Parcours dans le navigateur

| Vérification                                        | Résultat |
| --------------------------------------------------- | -------- |
| Thème clair / sombre                                |          |
| Largeur mobile                                      |          |
| États chargement / vide / erreur                    |          |
| Navigation (breadcrumb, menu, retour, rechargement) |          |

## À faire par l'utilisateur

- [ ] **<Rôle>** : ce qu'il doit voir, faire, et ce qui doit lui être refusé.
- [ ] Ce que l'agent n'a pas pu vérifier, et comment le vérifier.

## Dette et documentation

- **Ajouté à `docs/tech-debt.md`** :
- **Retiré de `docs/tech-debt.md`** :
- **Doc mise à jour** :
