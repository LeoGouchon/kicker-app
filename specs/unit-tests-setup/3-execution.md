# Journal d'exécution : mise en place des tests automatisés et de la CI

- **Statut** : en cours (cycle des statuts : `specs/README.md`)
- **Plan** : [2-plan.md](2-plan.md)

Le diff de la feature se calcule par `git diff origin/dev...HEAD` (depuis la base commune avec `dev`) : il reste
juste après un rebase, contrairement à un SHA noté ici.

## Tâches

Une ligne par tâche, ajoutée quand la tâche est faite. Une tâche absente n'est pas faite.

- **Tâche 1** : faite. Commit `test: set up vitest and testing library`. Vérification : `npm test` → 1 fichier,
  21 tests, 0 échec ; `npm run lint` → 0 erreur (18 warnings existants, aucun dans les nouveaux fichiers) ;
  `npm run build` → exit 0 ; `npm run test:watch` → `RERUN src/utils/roles.test.ts` après modification (annulée).

## Décisions

Chaque écart au plan ou ambiguïté tranchée, au moment où elle est prise :

- **Tâche 1** : `"test:watch": "vitest watch"` au lieu de `"vitest"` ; sans TTY (agent, terminal non interactif),
  `vitest` seul désactive le watch et s'exécute une fois. La sous-commande force le watch partout ; coût nul.
- **Tâche 1** : npm a retenu `jsdom@29` et non la dernière (31) : jsdom 31 exige Node `^24.15`, la machine locale est en
  24.12. jsdom 29 tourne sur tout Node 24 ; à monter quand le Node local suivra.
- **Tâche 1** : `server.deps.inline: ['antd']` non ajouté : pas nécessaire à ce stade, à revoir en tâche 5 si antd ne
  se charge pas.

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

Aucun pour l'instant.

## Bilan

À remplir quand toutes les tâches sont faites.
