# Plan : <titre de la feature>

- **Statut** : brouillon (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md)
- **Exécution** : dans la conversation | un sous-agent par tâche

**Objectif** : une phrase sur ce que la feature construit.

**Approche** : deux ou trois phrases sur la façon de faire et ce qu'on réutilise.

## Contraintes globales

Les exigences du brief et des conventions qui valent pour toutes les tâches, une par ligne, avec les valeurs exactes
(rôles, textes imposés, limites).

## Points de vigilance

Les cinq situations les plus probables que le brief implique mais qu'aucune tâche ne vérifiait au départ :

1. <entrée, état ou rôle> → <comportement attendu> (vérifié en tâche N)

## Carte des fichiers

| Fichier                          | Action   | Responsabilité |
| -------------------------------- | -------- | -------------- |
| `src/types/<Name>.type.ts`       | créer    |                |
| `src/hooks/api/use<Resource>.ts` | modifier |                |

---

### Tâche 1 : <nom>

**Fichiers** :

- Créer : `chemin/exact`
- Modifier : `chemin/exact`

**Interfaces** :

- Utilise : ce que la tâche prend aux tâches précédentes (noms et types exacts).
- Fournit : ce que les tâches suivantes utilisent (noms, props, types de retour).

- [ ] **Étape 1** : <action> dans `chemin/exact` : `signature exacte`.
- [ ] **Étape 2** : vérifier : `npm run build` → exit 0.
- [ ] **Étape 3** : commit `<type>(<scope>): <description>`.

### Tâche 2 : <nom>

…
