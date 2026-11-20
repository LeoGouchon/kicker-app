## Résumé

<!-- Quoi et pourquoi, en 2-3 lignes. Lien vers l'issue ou le besoin si il existe. -->

## Changements

-

## Plan de test

<!-- Ce que tu as vérifié à la main, pour que le relecteur puisse le reproduire. -->

- [ ] `npm run lint`, `npm run build` et `npm test` passent
- [ ] Desktop et mobile (sous le breakpoint `md`)
- [ ] Thème clair et sombre
- [ ] Rôles concernés : anonyme / user / modérateur / admin
- [ ] États chargement, vide et erreur

## Captures

<!-- Avant / après si l'UI change. Supprimer la section sinon. -->

## Checklist

- [ ] Titre de PR au format Conventional Commits (`type(scope): description`), base `dev`
- [ ] Conventions respectées (`docs/conventions/`), aucun nouvel écart listé dans `docs/tech-debt.md`
- [ ] Doc mise à jour si une convention, un process ou l'architecture change (fichiers ≤ 200 lignes, sommaires à jour)
- [ ] ADR ajouté si la PR contient une décision structurante (`docs/decisions/`)
- [ ] Points de `docs/tech-debt.md` corrigés au passage retirés de la liste
