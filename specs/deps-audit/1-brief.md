# Brief : audit et mise à jour des dépendances

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Branche** : `chore/deps-audit`
- **Date** : 2026-11-22

## Besoin

Les dépendances du projet n'ont pas été mises à jour depuis plusieurs mois. Le 2026-11-20, `npm audit` remontait
**14 vulnérabilités (6 hautes, 8 modérées)**, dont axios (12 avis) et Vite (6 avis), toutes corrigeables sans version
majeure. Rien ne signale les nouvelles versions ni les nouveaux avis : ni Dependabot ni Renovate, et pas d'audit en CI.
Il n'existe pas non plus de marche à suivre pour mettre à jour une dépendance. Le problème concerne les développeurs
et, à travers axios, la sécurité de l'application livrée.

## Solution retenue

Une branche de maintenance, sans changement fonctionnel visible :

1. **Nettoyage de `package.json`** : suppression de `@ant-design/plots` (jamais importé), passage de
   `eslint-plugin-simple-import-sort` et `eslint-plugin-unused-imports` en `devDependencies`.
2. **Correctifs de sécurité** : `npm audit` revient à 0 vulnérabilité.
3. **Mises à jour mineures et correctives** de toutes les dépendances, bibliothèques d'exécution comprises (antd 6.7,
   React 19.3, TanStack Query 5.108, React Router, axios, Chart.js, dayjs…) et outillage (Vite, ESLint 9, Vitest,
   `typescript-eslint`…), avec TypeScript 5.8 → 5.9. Les versions minimales de `package.json` sont remontées aux
   versions installées.
4. **Dependabot** pour la suite, avec un seul fichier de configuration et aucun réglage côté GitHub.
5. **Une fiche de process** sur la mise à jour des dépendances.
6. **La dette** : versions majeures reportées, sécurité GitHub et absence de tests des écrans.

Aucun écran n'est modifié.

## Rôles et accès

Aucun changement : aucun écran, aucune route ni aucun droit n'est touché.

## Scénarios

1. En tant que développeur, je veux que `npm audit` ne remonte aucune vulnérabilité, afin de livrer une application
   sans faille connue dans ses dépendances.
2. En tant que développeur, je veux recevoir des PR Dependabot vers `dev`, afin de ne plus laisser les dépendances
   vieillir sans le savoir.
3. En tant que développeur, je veux une fiche qui dit comment auditer et mettre à jour une dépendance, afin de traiter
   une PR Dependabot ou une version majeure sans improviser.

## Données et API

Aucun endpoint concerné. axios change de version mineure (1.19 → 1.21) : le client HTTP et ses intercepteurs
(authentification, renouvellement du token) ne changent pas.

## Règles métier et cas limites

- **Pas de version majeure** dans cette branche. Celles qui sont disponibles sont reportées dans `tech-debt.md`, une
  ligne par paquet :
    - ESLint 10 et `@eslint/js` 10 ;
    - TypeScript 7, bloqué par `typescript-eslint`, qui n'accepte pas au-delà de 6.0 ;
    - FontAwesome 7 et `react-fontawesome` 3 ;
    - `eslint-plugin-react-hooks` 7 (nouvelles règles React Compiler) ;
    - `globals` 17, `lint-staged` 17, `eslint-plugin-simple-import-sort` 14, `eslint-plugin-react-refresh` 0.5.
- **Jamais `npm audit fix --force`** : il fait des versions majeures sans le dire.
- **Vulnérabilité qui apparaît d'ici la fin** : si un nouvel avis ne se corrige pas sans version majeure, il est accepté
  à condition d'être justifié dans le rapport de vérification et noté dans `tech-debt.md`.
- **Dependabot** lit sa configuration **sur la branche par défaut (`main`)** : il ne démarrera qu'après la prochaine
  release `dev` → `main`. C'est accepté.
- **Configuration Dependabot** :
    - branche cible `dev` ;
    - écosystèmes npm et GitHub Actions, une fois par semaine ;
    - `devDependencies` : une PR groupée pour les mises à jour mineures et correctives ;
    - dépendances d'exécution : une PR par paquet ;
    - versions majeures npm ignorées ;
    - GitHub Actions : une PR groupée ;
    - commits préfixés `chore(deps)`.
- **Après cette branche** : tant que les écrans n'ont pas de tests, une seule bibliothèque d'exécution par PR. Cette
  branche fait exception : elle rattrape le retard en une fois, avec le lint, le build et les tests unitaires comme
  filet.
- **Commits séparés par lot**, pour retrouver et annuler un lot en cas de régression :
    1. nettoyage de `package.json` ;
    2. correctifs de sécurité ;
    3. mises à jour des bibliothèques d'exécution ;
    4. mises à jour de l'outillage ;
    5. Dependabot et doc.

## États de l'interface

Sans objet : aucun écran modifié.

## Critères d'acceptation

La phase de vérification les reprend un par un.

- [ ] `npm audit` affiche 0 vulnérabilité. Sinon, chaque vulnérabilité restante est justifiée dans le rapport et notée
      dans `tech-debt.md`.
- [ ] `npm outdated` ne liste plus que des versions majeures. Chacune a sa ligne dans `tech-debt.md`.
- [ ] TypeScript est en 5.9.x.
- [ ] Les versions minimales de `package.json` correspondent aux versions installées.
- [ ] `@ant-design/plots` est supprimé et sa ligne P3 est retirée de `tech-debt.md`.
- [ ] `eslint-plugin-simple-import-sort` et `eslint-plugin-unused-imports` sont dans `devDependencies`.
- [ ] `npm run lint`, `npm run build` et `npm test` passent, en local et en CI.
- [ ] `.github/dependabot.yml` respecte la configuration décrite dans « Règles métier et cas limites ».
- [ ] `docs/process/update-dependencies.md` existe et couvre ces sections :
    - fichiers clés ;
    - quand mettre à jour ;
    - auditer ;
    - mineures et correctifs ;
    - version majeure ;
    - traiter une PR Dependabot ;
    - règles.

        Elle est listée dans `docs/process/README.md`.

- [ ] `docs/process/release.md` contient une case « `npm audit` sans vulnérabilité haute ».
- [ ] `docs/conventions/git-workflow.md` note l'exception des branches Dependabot (`dependabot/...`, hors format
      `<type>/<kebab>`).
- [ ] `tech-debt.md` contient ces lignes :
    - les versions majeures reportées ;
    - l'activation des alertes et correctifs de sécurité Dependabot dans les Settings GitHub ;
    - l'ajout de `npm audit` en CI ;
    - l'absence de tests des écrans (dette de test technique).
- [ ] L'historique de la branche suit les lots décrits dans « Règles métier et cas limites ».

## Hors périmètre

- Toute version majeure (liste ci-dessus).
- L'activation des alertes et des correctifs de sécurité Dependabot dans les Settings GitHub.
- `npm audit` dans la CI.
- Le parcours manuel dans le navigateur. Il n'est pas un critère d'acceptation de cette branche. L'absence de tests des
  écrans est notée comme dette.
- L'écriture de tests (de composants ou de bout en bout).
- La correction des warnings ou de la dette existants qui ne sont pas liés aux mises à jour.

## Décisions

- **Toutes les mises à jour mineures, bibliothèques d'exécution comprises** : choix de l'utilisateur, qui accepte le
  risque malgré l'absence de tests des écrans.
- **Aucune version majeure** : chacune demande sa propre PR. Les versions majeures de l'outillage sont exclues aussi,
  pour garder la branche lisible.
- **Dependabot réduit à un fichier** : aucun réglage côté GitHub. Les alertes de sécurité et l'audit en CI vont dans
  la dette.
- **Branche cible de Dependabot : `dev`** : elle respecte la règle « jamais directement sur `main` », au prix d'un
  démarrage après la prochaine release.
- **Pas de parcours dans le navigateur** : l'utilisateur le retire des critères. Le manque de tests des écrans est
  noté en dette.
- Pas d'ADR : un fichier Dependabot et des montées de version se défont facilement.

## Glossaire

- Aucun : le sujet est purement technique.
