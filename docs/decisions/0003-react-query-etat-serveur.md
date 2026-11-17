# 0003. TanStack Query comme source d'état serveur

- **Statut** : Accepté
- **Date** : 2026-11-11 (formalise un choix existant)

## Contexte

L'application affiche surtout des données de l'API : matchs, joueurs, classements, statistiques. Elle les relit
souvent et les invalide après chaque saisie de match. Il faut gérer le cache, le chargement, les erreurs, la
pagination et la synchronisation après mutation, sans réécrire cette mécanique à chaque écran.

## Options envisagées

1. **`useEffect` + `useState` par composant** : simple au départ, mais pas de cache partagé, des requêtes dupliquées,
   et un chargement et des erreurs gérés à la main.
2. **Store global** (Redux, Zustand) contenant les réponses de l'API : beaucoup de code pour reproduire ce qu'une
   librairie de cache serveur fait nativement.
3. **TanStack Query** : cache par clé, déduplication, `staleTime`, invalidation, pagination et infinite queries.

## Décision

Nous utilisons TanStack Query (v5) comme **unique** source d'état serveur :

- **Hooks** : tous les appels passent par des hooks `use<Resource>` dans `src/hooks/` (cible : `src/hooks/api/`), avec
  une fabrique de query keys par ressource.
- **Mutations** : elles invalident les clés concernées dans leur `onSuccess`.
- **Pas de store global** : l'état client partagé se limite au thème et à l'utilisateur courant (contextes React),
  plus quelques préférences en `localStorage`.
- **Pas de recopie** : les données serveur ne sont pas recopiées dans un `useState`.

## Conséquences

- **Positives** :
    - écrans simples, avec des états `isPending` / `isError` standard ;
    - cache partagé entre pages ;
    - rafraîchissement automatique après mutation.
- **Négatives** :
    - la justesse des query keys et des invalidations devient critique : une clé incomplète sert des données fausses ;
    - les données dérivées (stats après un match) doivent être invalidées explicitement.
- **Suivi** :
    - conventions dans `conventions/api-hooks.md` ;
    - envisager `@tanstack/eslint-plugin-query` et des `defaultOptions` globales du `QueryClient` (voir
      `tech-debt.md`).
