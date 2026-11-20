# Brief : mise en place des tests automatisés et de la CI

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Branche** : `test/unit-tests-setup`
- **Date** : 2026-11-20

## Besoin

Le projet n'a aucun test automatisé. La vérification d'une PR est entièrement manuelle (lint, build, parcours dans le
navigateur), et rien n'empêche de merger une PR qui casse le lint ou le build. La logique pure (droits, redirection
après connexion, filtres, saisons) peut régresser sans que personne ne le voie. Les développeurs et les agents IA qui
mènent le workflow `/feature` n'ont pas de commande de test sur laquelle s'appuyer.

## Solution retenue

Feature d'outillage, sans changement visible pour les utilisateurs de l'application :

- **Outillage** : Vitest, Testing Library (`@testing-library/react`, `user-event`, `jest-dom`) et jsdom, avec les
  scripts `npm test` (exécution unique) et `npm run test:watch` (en continu).
- **Tests pilotes** : sur la logique pure existante et sur un composant témoin, pour prouver que l'outillage fonctionne
  (voir Scénarios). Ce n'est pas une campagne de couverture.
- **CI** : un workflow GitHub Actions qui lance `npm ci`, `npm run lint`, `npm run build` et `npm test` sur chaque PR
  vers `dev` et `main`. La version de Node est fixée dans le dépôt, alignée sur celle de Vercel.
- **Règles** : l'exigence et les conventions d'écriture des tests sont documentées (ADR 0007, `conventions/testing.md`).

## Rôles et accès

Sans objet : aucun écran ni droit modifié.

## Scénarios

1. En tant que développeur, je lance `npm test` et j'obtiens le résultat de toute la suite en une exécution.
2. En tant que développeur, je lance `npm run test:watch` pendant que je code, et les tests concernés se relancent à
   chaque modification.
3. En tant que relecteur, j'ouvre une PR vers `dev` ou `main` et je vois un check GitHub qui indique si le lint, le
   build et les tests passent.
4. En tant qu'agent IA en phase `/verifier`, je lance `npm test` comme preuve, en plus du lint et du build.

**Tests pilotes sur la logique pure** :

- `roles` : `hasRole`, `hasAnyRole`, `isAdmin`, `isModeratorOrAdmin`, y compris avec un utilisateur absent (`null`,
  `undefined`) ou sans rôle ;
- `returnTo` : chemin interne accepté ; repli sur `/` pour un état absent ou mal formé, une valeur qui n'est pas une
  chaîne, une URL absolue (`https://…`) ou une URL qui commence par `//` (redirection externe) ;
- `constructComplexPlayerFilter` : filtre absent (chaîne vide), un ou plusieurs groupes de joueurs, encodage des
  valeurs ;
- `quarterChanges` : un marqueur à chaque changement de saison, aucun marqueur pour une liste vide ou une seule
  saison, dates fournies dans le désordre, libellé `AAAA-T`. Le fuseau horaire est fixé pour les tests ;
- `EnhancedTable.utils` : lecture et écriture des filtres en localStorage (rien de stocké, JSON invalide, clés de
  métrique inconnues ignorées), bornes top et bottom par métrique (moins de 5 lignes, sinon la 5ᵉ valeur), affichage
  en pourcentage.

**Composant témoin `MatchLine`** :

- un match en 1 contre 1 n'affiche qu'un joueur par équipe ; un match en 2 contre 2 en affiche deux ;
- le score de chaque équipe est affiché ;
- les noms suivent le format « Prénom N. » ;
- le temps écoulé s'affiche (« Il y a 2 heures », « Il y a moins d'une minute »), avec une horloge figée.

## Données et API

Sans objet : aucun endpoint appelé. Les hooks TanStack Query ne sont pas testés dans cette feature (voir Hors
périmètre).

## Règles métier et cas limites

- **Exigence de tests pour les features suivantes** : un test est obligatoire pour toute logique pure créée ou
  modifiée (`.utils`, `.reducer`, `src/utils/`). Les tests de composants se décident au cas par cas. Le TDD n'est pas
  imposé.
- **Bug révélé par un test pilote** : on ne le corrige pas dans cette feature, qui ne change aucun comportement. On
  l'ajoute à `docs/tech-debt.md`, et le test du comportement attendu est marqué en attente avec un renvoi vers la dette.
  On propose aussi une issue GitHub, créée seulement après validation de l'utilisateur.
- **Dates** : tout test qui dépend de la date ou du fuseau horaire les maîtrise (fuseau fixé, horloge figée). Il ne
  doit pas dépendre de la machine ni du jour où il tourne.
- **Check obligatoire** : le workflow est livré par la PR. Une fois qu'il a tourné une première fois, l'agent ajoute le
  check comme « required status check » avec `gh` : dans le ruleset existant de `main`, et dans un nouveau ruleset pour
  `dev`. Il demande une **confirmation explicite** de l'utilisateur avant de toucher aux réglages du dépôt.

## États de l'interface

Sans objet : aucune interface modifiée.

## Critères d'acceptation

La phase de vérification les reprend un par un.

- [ ] `npm test` lance toute la suite une fois et se termine avec 0 échec (sauf les tests marqués en attente pour un
      bug listé en dette).
- [ ] `npm run test:watch` relance les tests en continu.
- [ ] `npm run lint` et `npm run build` passent, fichiers de test compris (les tests sont typés et lintés comme le
      reste du code).
- [ ] Les tests pilotes de la logique pure couvrent les cas listés dans Scénarios, pour les cinq modules.
- [ ] Le test de `MatchLine` couvre le 1 contre 1, le 2 contre 2, le score, le format des noms et le temps écoulé.
- [ ] Les tests passent quel que soit le fuseau horaire de la machine (vérifié en en changeant un).
- [ ] Un helper de rendu partagé fournit les providers (antd, router, QueryClient) aux tests de composants.
- [ ] Les tests suivent les conventions : imports explicites depuis `vitest` (pas de globals), descriptions en
      anglais, requêtes par rôle ou par texte visible, fichier colocalisé.
- [ ] Le workflow GitHub Actions tourne sur une PR vers `dev` et échoue si le lint, le build ou un test échoue.
- [ ] Le pre-commit et le build Vercel ne lancent pas les tests.
- [ ] Le code applicatif n'est pas modifié (aucun changement de comportement).
- [ ] La doc est à jour :
    - ADR 0007 et sommaire des ADR ;
    - nouveau `conventions/testing.md`, ajouté au sommaire des conventions ;
    - `CLAUDE.md` : commandes, et suppression de « pas de tests automatisés » ;
    - `getting-started.md` ;
    - `process/pull-request.md` : checklist, CI, et marche à suivre pour rendre le check obligatoire ;
    - `process/new-feature.md` ;
    - `tech-debt.md` : « Aucun test automatisé » retiré, bugs trouvés ajoutés ;
    - skill `planifier` : rappel de l'exigence de tests.
- [ ] Après le merge du workflow, le check est requis au merge sur `main` et `dev` (rulesets modifiés avec `gh`, après
      confirmation de l'utilisateur).

## Hors périmètre

- **Hooks TanStack Query** : leurs tests et le choix du mock HTTP (MSW ou `vi.mock`) feront l'objet d'une feature et
  d'un ADR à part.
- **Couverture de code** : ni outil ni seuil. C'est à rediscuter plus tard (piste : un seuil sur le nouveau code
  seulement, voir le suivi de l'ADR 0007).
- **Tests dans le pre-commit** et **dans le build Vercel**.
- **Tests de bout en bout** (Playwright ou équivalent).
- **Correction des bugs** révélés par les tests pilotes : ils sont listés dans la dette, et le correctif aura sa propre
  PR `fix`.
- **Autres tests** que les tests pilotes listés ci-dessus.
- **Skill `cadrer` en une question à la fois** : à traiter dans une branche à part (`docs/cadrer-one-question`).
- **Skill `planifier` plus détaillée** (ajouté à la planification) : le plan doit nommer chaque fichier, avec le
  changement et la logique à y coder, pour que l'implémentation parte de l'architecture presque complète. À traiter
  dans une branche à part (`docs/planifier-file-detail`).

## Décisions

- **Outil** : Vitest, Testing Library et jsdom. Vitest réutilise la config Vite, et jsdom est le plus compatible avec
  antd. Voir l'[ADR 0007](../../docs/decisions/0007-tests-automatises.md).
- **Exigence** : tests obligatoires pour la logique pure, au cas par cas pour les composants, sans TDD imposé. C'est
  le meilleur rapport coût/valeur, et ça colle à la règle qui sort la logique dans les `.utils` (ADR 0007).
- **Emplacement** : tests colocalisés. C'est cohérent avec les fichiers satellites, et le test suit le fichier lors de
  la migration vers `src/pages/`.
- **Conventions d'écriture** : celles recommandées officiellement par Testing Library, plus les règles d'import et de
  langue du projet.
- **CI dans cette feature** : préparer les tests sans les vérifier au merge n'aurait pas de sens. Lint et build sont
  ajoutés au même job, car ce sont déjà des prérequis de PR.
- **Pas de tests dans le pre-commit** : le pre-commit doit rester rapide.
- **Couverture** : décision repoussée, mais tracée dans le suivi de l'ADR 0007.
- **Version de Node** (ajouté à la planification) : `24.x`, celle du projet Vercel. Elle est fixée par `engines.node`
  dans `package.json`, que lisent à la fois Vercel et `actions/setup-node` : une seule source de vérité.

## Glossaire

Aucun terme ajouté : la feature est purement technique.
