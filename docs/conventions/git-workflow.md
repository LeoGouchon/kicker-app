# Workflow Git

Branches, commits et flux de merge. Le pas-à-pas d'une PR est dans
[../process/pull-request.md](../process/pull-request.md).

## Fichiers clés

- `.husky/pre-commit` : lance `npx lint-staged` (ESLint et Prettier sur les fichiers indexés).
- `.github/pull_request_template.md` : modèle de description de PR.

## Branches

```
feature branch ──PR (squash)──► dev ──PR « release » (merge commit)──► main ──► déploiement
```

| Branche                      | Rôle             | Règle                                                                 |
| ---------------------------- | ---------------- | --------------------------------------------------------------------- |
| `main`                       | Production       | Jamais de push direct. N'évolue que par la PR de release depuis `dev` |
| `dev`                        | Intégration      | Base de toutes les branches de travail. Jamais de push direct         |
| `<type>/<kebab-description>` | Travail en cours | Créée depuis `dev` à jour, supprimée après le merge                   |

- **Nom de branche** : `<type>/<description-kebab>`, avec le même `type` que les commits.
    - Exemples : `feat/match-public-code`, `fix/remove-auto-redirection`, `docs/project-conventions`.
- **Création** :
    ```bash
    git switch dev && git pull
    git switch -c feat/ma-feature
    ```
- **Une branche = un sujet.** Si la branche prend du retard, rebaser sur `dev` (`git rebase origin/dev`) plutôt que
  merger `dev` dedans.

## Commits : Conventional Commits

Format : [Conventional Commits 1.0.0](https://www.conventionalcommits.org/fr/v1.0.0/).

```
<type>(<scope>): <description>

[corps facultatif : le pourquoi, en anglais]
```

- **Description** : en **anglais**, à l'impératif, en minuscules, sans point final.
    - Exemple : `fix(player): show fallback for missing elo`.
- **Scope** : le domaine touché (nom de page ou de module, `auth`, `breadcrumb`…). Il est facultatif si le changement
  est transverse.
- **Breaking change** : `!` après le scope (`feat(auth)!: …`), expliqué dans le corps.

| Type       | Usage dans ce projet                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité visible                                                                                         |
| `fix`      | Correction de bug                                                                                                       |
| `refactor` | Restructuration sans changement de comportement                                                                         |
| `style`    | Changement **visuel / UI** sans logique (marges, titres, couleurs). Diffère de la spec, où `style` désigne le formatage |
| `perf`     | Amélioration de performance                                                                                             |
| `docs`     | Documentation (`docs/`, `specs/`, `README.md`, `CLAUDE.md`)                                                             |
| `test`     | Ajout ou correction de tests                                                                                            |
| `chore`    | Maintenance : dépendances, configuration, petits ajustements sans impact fonctionnel                                    |
| `ci`       | Outillage de build, scripts, Makefile, hooks                                                                            |

- **Pas de `wip`** dans l'historique de `dev`. Les commits intermédiaires sont acceptés dans la branche, car le squash
  les fusionne.
- **Hooks de pre-commit** : ne jamais les contourner (`--no-verify`). S'il échoue, corriger le problème.

## Merges

- **Branche → `dev`** :
    - **squash merge** ;
    - le titre de la PR devient le message du commit et suit donc le format Conventional Commits ;
    - le numéro de PR est ajouté automatiquement : `feat(breadcrumb): add dynamic breadcrumb (#24)`.
- **`dev` → `main`** : **merge commit**, sans squash. Squasher `dev` dans `main` désynchroniserait les deux
  historiques et provoquerait des conflits à la release suivante. Voir [../process/release.md](../process/release.md).
- Supprimer la branche après le merge.
