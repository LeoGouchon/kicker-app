# 0007. Tests automatisés avec Vitest et vérification en CI

- **Statut** : Proposé
- **Date** : 2026-11-20

## Contexte

Le projet n'a aucun test automatisé : la vérification d'une PR est manuelle (lint, build, parcours dans le navigateur).
La logique pure (droits, redirection après connexion, filtres, saisons) peut régresser sans que personne ne le voie.
L'ADR [0006](0006-workflow-feature.md) prévoit que la mise en place des tests soit la première feature du workflow, et
que cet ADR fixe le niveau d'exigence. Rien ne bloque non plus une PR dont le lint ou le build échoue : aucune CI
n'existe sur GitHub.

## Options envisagées

1. **Jest + Testing Library** : la référence historique. Mais il faut une seconde chaîne de transformation (Babel ou
   ts-jest) en parallèle de Vite, et le support ESM et des imports en `.ts` demande de la configuration.
2. **Vitest + Testing Library + jsdom** : Vitest réutilise la config Vite (plugins, résolution, ESM) et son API est
   compatible avec Jest. jsdom est l'environnement DOM le plus complet et le plus utilisé avec antd.
3. **Vitest + happy-dom** : plus rapide que jsdom, mais moins complet. Les composants antd s'appuient sur des API DOM
   (`matchMedia`, mesures, `getComputedStyle`) où les écarts sont plus fréquents.
4. **Tests de bout en bout seuls** (Playwright) : proches du rendu réel, mais lents. Ils demandent aussi des comptes
   OIDC et un backend, et ne ciblent pas la logique pure.

## Décision

Nous utilisons **Vitest**, **Testing Library** (`@testing-library/react`, `user-event`, `jest-dom`) et **jsdom**.

- **Exigence** : un test est **obligatoire** pour toute logique pure créée ou modifiée (`.utils`, `.reducer`,
  `src/utils/`). Les tests de composants se décident au cas par cas. Le TDD n'est pas imposé.
- **Emplacement** : le test est colocalisé à côté du fichier testé (`roles.ts` → `roles.test.ts`).
- **Écriture** : on suit les recommandations officielles de Testing Library (requêtes par rôle ou par texte visible,
  `user-event` pour les interactions). Les conventions détaillées sont dans `conventions/testing.md`.
- **Exécution** : `npm test` lance la suite une fois, `npm run test:watch` en continu. Les tests ne tournent ni dans
  le pre-commit (il doit rester rapide) ni dans le build Vercel.
- **CI** : un workflow GitHub Actions lance lint, build et tests sur chaque PR vers `dev` et `main`. Ce check est
  rendu obligatoire au merge par les rulesets du dépôt.
- **Hooks de données** : les hooks TanStack Query ne sont pas couverts pour l'instant. Le choix du mock HTTP (MSW ou
  `vi.mock`) fera l'objet d'un ADR à part.

## Conséquences

- **Positives** :
    - la logique pure est protégée contre les régressions ;
    - une PR ne peut plus être mergée si le lint, le build ou les tests échouent ;
    - les phases `/planifier`, `/implementer` et `/verifier` s'appuient sur `npm test`.
- **Négatives / coûts** :
    - de nouvelles dépendances de développement à maintenir ;
    - jsdom ne voit pas le rendu réel (styles, mise en page) : le parcours dans le navigateur reste nécessaire ;
    - une minute de CI environ par PR.
- **Suivi** :
    - **couverture de code** : ni outil ni seuil pour l'instant. À rediscuter une fois une base de tests en place.
      Piste retenue : un seuil appliqué **au nouveau code seulement** (couverture du diff, comme les rapports
      SonarQube), plutôt qu'un seuil global qui pénaliserait l'existant non testé ;
    - **hooks de données** : ADR sur le mock HTTP, puis tests des hooks `src/hooks/` ;
    - les bugs révélés par les premiers tests vont dans `tech-debt.md`, et non dans la PR qui installe les tests.
