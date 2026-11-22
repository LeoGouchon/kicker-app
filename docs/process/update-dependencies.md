# Mettre à jour les dépendances

Auditer les dépendances, appliquer les mises à jour mineures et correctives, mener une version majeure et traiter les
PR Dependabot sans casser l'application.

## Fichiers clés

- `package.json` : plages des dépendances. La version minimale de chaque plage vaut la version installée.
- `package-lock.json` : arbre installé, modifié uniquement par `npm`.
- `.github/dependabot.yml` : PR hebdomadaires vers `dev` (npm et GitHub Actions), versions majeures npm ignorées.
- `docs/tech-debt.md` : section « Dépendances : versions majeures reportées ».

## Quand mettre à jour

- **Chaque semaine** : Dependabot ouvre ses PR vers `dev`. Les traiter dans la semaine (voir plus bas).
- **Avant une release** : `npm audit` ne doit remonter aucune vulnérabilité haute (case de
  [release.md](release.md)).
- **À l'annonce d'une faille** touchant une dépendance : auditer tout de suite, sans attendre Dependabot.

## Auditer

```bash
npm audit       # vulnérabilités connues, avec leur gravité et le correctif disponible
npm outdated    # versions disponibles
```

Dans `npm outdated` :

- **Current** : la version installée ;
- **Wanted** : la plus récente que la plage de `package.json` autorise (mineure ou corrective) ;
- **Latest** : la plus récente publiée. Si elle diffère de `Wanted` par le premier chiffre, c'est une version majeure.
  Pour un paquet en `0.x`, c'est le deuxième chiffre (0.4 → 0.5 est cassant). Dependabot, lui, y voit une mineure :
  un tel paquet a sa propre entrée `ignore` (`version-update:semver-minor`) dans `.github/dependabot.yml`.

Pour une vulnérabilité, `npm audit fix` (**sans** `--force`) applique les correctifs compatibles avec les plages.
Relancer `npm audit` ensuite : un second passage est parfois nécessaire pour une dépendance indirecte. Ce qui reste
exige une version majeure : voir « Version majeure ».

## Mineures et correctifs

1. Monter le paquet à la version `Wanted`, en remontant la plage :
    ```bash
    npm install <paquet>@^<version>        # dépendance d'exécution
    npm install -D <paquet>@^<version>     # outillage
    ```
2. Vérifier que la plage de `package.json` vaut bien la version installée (`npm ls <paquet>`).
3. Lancer le filet : `npm run lint`, `npm run build`, `npm test`. Comparer le nombre de warnings du lint avant et
   après : une mise à jour ne doit pas en ajouter.
4. **Une bibliothèque d'exécution par PR** (antd, React, TanStack Query, React Router, axios, Chart.js…) tant que les
   écrans n'ont pas de tests : en cas de régression, le revert ne touche qu'elle. L'outillage peut être groupé.
   Exception : `react` et `react-dom` se montent toujours ensemble, à la même version.
5. Pour une bibliothèque d'exécution, parcourir les écrans qu'elle touche avec `make dev`.

## Version majeure

1. **Une PR par paquet** (ou par famille indissociable, ex. `eslint` et `@eslint/js`), branche
   `chore/<paquet>-<version>`.
2. Lire le guide de migration et le changelog. Noter dans la PR les changements cassants qui touchent le projet.
3. `npm install <paquet>@^<version>`, puis corriger le code, la config ou les règles impactés.
4. Filet complet et parcours des écrans concernés.
5. Retirer la ligne du paquet dans `docs/tech-debt.md`, et mettre à jour la doc qui cite la version
   (`docs/architecture/overview.md` pour la stack).

**Paquets liés** : une version majeure peut être bloquée par la plage d'un autre paquet. TypeScript en est l'exemple :
`typescript-eslint` déclare la plage de TypeScript qu'il accepte (`npm view typescript-eslint peerDependencies`).
Tant que la nouvelle version n'y est pas, attendre une version de `typescript-eslint` qui l'accepte, puis monter les
deux dans la même PR.

## Traiter une PR Dependabot

Dependabot lit sa configuration sur la branche par défaut (`main`) : il ne démarre qu'après la première release qui
y porte `.github/dependabot.yml`. Ses PR ciblent ensuite `dev`, sur des branches `dependabot/...`.

- **Dépendance d'exécution** : une PR par paquet, sauf `react` et `react-dom`, groupés : `react-dom` plante au
  démarrage si sa version diffère de celle de `react`.
- **Outillage** (`devDependencies`) : une PR groupée pour les mineures et correctifs.
- **GitHub Actions** : une PR groupée.

Pour chaque PR :

- [ ] La CI est verte (lint, build, tests).
- [ ] Le changelog lié dans la description ne signale rien qui touche le projet.
- [ ] Bibliothèque d'exécution : récupérer la branche, `npm ci`, puis `make dev` et parcourir les écrans concernés.
- [ ] Squash merge vers `dev` : le titre est déjà au format `chore(deps): bump …`.

Une PR Dependabot qui échoue se corrige en poussant un commit sur sa branche, ou se ferme avec une ligne dans
`docs/tech-debt.md` si la correction demande une vraie migration.

## Règles

- **Jamais `npm audit fix --force`** : il passe des versions majeures sans le dire.
- **Jamais d'édition à la main de `package-lock.json`** : toujours via `npm install`, `npm uninstall` ou
  `npm audit fix`.
- **Pas de version majeure mêlée à des mineures** dans une même PR.
- **`npm ci` en CI** et après un changement de branche : il installe exactement le lockfile.
- **Pas de nouvelle dépendance pour quelques lignes** : voir d'abord ce que le projet, antd, React ou le navigateur
  font déjà.
