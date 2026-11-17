# Journal d'exécution : <titre de la feature>

- **Statut** : en cours | à valider | terminé
- **Plan** : [2-plan.md](2-plan.md)

Le diff de la feature se calcule par `git diff origin/dev...HEAD` (depuis la base commune avec `dev`) : il reste
juste après un rebase, contrairement à un SHA noté ici.

## Tâches

Une ligne par tâche, ajoutée quand la tâche est faite. Une tâche absente n'est pas faite.

- **Tâche 1** : faite. Commits `<sha>..<sha>`. Vérification : `npm run lint` ok, `npm run build` ok.

## Décisions

Chaque écart au plan ou ambiguïté tranchée, au moment où elle est prise :

- **Tâche N** : <ce qui a été décidé> ; <pourquoi> ; <ce que ça coûte si c'est faux>.

## Raccourcis

Chaque `// shortcut:` laissé dans le code :

- `chemin:ligne` : <la limite> ; <quand y revenir>.

## Bilan

À remplir quand toutes les tâches sont faites : ce qui a été construit en trois lignes, et ce que la vérification doit
regarder en priorité.
