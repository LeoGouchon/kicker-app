# Structure du projet

Où ranger chaque fichier, comment le nommer et quand extraire de la logique d'un composant.

> **Transition** : le code existant est encore dans `src/modules/<camelCase>/` et `src/hooks/useApiEndPoint/`. La
> migration vers la structure ci-dessous se fera dans une PR dédiée (voir [../tech-debt.md](../tech-debt.md)).
> D'ici là, **toute nouvelle page** est créée directement selon cette convention. On ne déplace pas un module
> existant au détour d'une feature.

## Arborescence cible

```
src/
├── pages/                         une page routée = un dossier
│   └── match-history/
│       ├── MatchHistory.tsx       composant routé (export nommé)
│       ├── MatchHistory.style.tsx
│       ├── MatchHistory.utils.tsx
│       ├── MatchHistory.reducer.tsx
│       ├── components/            sous-composants utilisés seulement par cette page
│       │   └── match-card/
│       │       ├── MatchCard.tsx
│       │       ├── MatchCard.style.tsx
│       │       └── MatchCard.skeleton.tsx
│       └── hooks/                 hooks utilisés seulement par cette page
│           └── useMatchFilters.ts
├── components/                    composants partagés (≥ 2 pages)
│   └── link-player/LinkPlayer.tsx
├── hooks/                         hooks partagés
│   ├── api/                       hooks TanStack Query, un fichier par ressource
│   │   └── useMatch.ts
│   └── useMenuItems.tsx
├── auth/  context/  routes/       infrastructure (voir architecture/)
├── types/                         DTO de l'API : <Name>.type.ts
└── utils/                         fonctions pures partagées
```

## Règles de rangement

1. **Local d'abord.** Un composant ou un hook utilisé par une seule page vit dans `pages/<page>/components/` ou
   `pages/<page>/hooks/`.
2. **Partagé dès la 2ᵉ page.** Quand une 2ᵉ page en a besoin, on le déplace dans `src/components/` ou `src/hooks/`
   (dans la même PR) au lieu de l'importer depuis l'autre page.
3. **Jamais d'import entre pages.** `pages/a/` n'importe rien de `pages/b/`. ⚠️ Aujourd'hui, `player` importe
   `history/components/MatchCard` et `publicNewMatch` importe `newMatch/components/MatchForm`.
4. **Sens des dépendances** : `pages` → `components` / `hooks` → `utils` / `types`. `utils` et `types` n'importent
   jamais un composant. ⚠️ `utils/quarterChanges.ts` importe un type depuis `SeasonedElo.tsx`.
5. **Hooks API** : toujours dans `src/hooks/api/`, même s'ils ne servent qu'à une page. Le cache est global et la
   ressource est partagée.
6. **Types** :
    - DTO et payloads de l'API dans `src/types/<Name>.type.ts` ;
    - types internes à un composant dans son fichier ;
    - types partagés entre les fichiers d'un même dossier dans `<Composant>.type.ts`.
7. **Pas de barrel** (`index.ts` qui ré-exporte) : on importe le fichier directement.

## Nommage des fichiers et dossiers

| Élément                                    | Convention                          | Exemple                                            |
| ------------------------------------------ | ----------------------------------- | -------------------------------------------------- |
| Dossiers (pages, composants, hooks, utils) | **kebab-case**                      | `kicker-match-codes/`, `link-player/`              |
| Composant                                  | PascalCase, = nom de l'export       | `KickerMatchCodes.tsx`                             |
| Dossier d'un composant                     | kebab-case du composant             | `match-card/MatchCard.tsx`                         |
| Hook                                       | camelCase, = nom du hook            | `useMatchFilters.ts` (`.tsx` s'il contient du JSX) |
| Type d'API                                 | PascalCase + `.type.ts` (singulier) | `Match.type.ts`                                    |
| Utilitaire partagé                         | camelCase                           | `utils/roles.ts`                                   |

La page porte le nom de sa fonction, et son dossier en est le kebab-case : `pages/ranking/Ranking.tsx`, pas
`mainStats/MainStats.tsx` servi sur `/ranking`.

## Fichiers satellites d'un composant

Un composant `Xxx.tsx` peut avoir, **à côté de lui** :

| Fichier            | Contenu                                               | Quand le créer                                                       |
| ------------------ | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `Xxx.style.tsx`    | **Tous** les composants stylés de `Xxx`               | dès qu'il y a du style (voir [styling.md](styling.md))               |
| `Xxx.utils.tsx`    | Fonctions **pures** : calcul, formatage, mapping, tri | dès qu'une fonction ne dépend ni de hooks ni de state                |
| `Xxx.reducer.tsx`  | `State`, `Action`, `initialState`, `reducer`          | quand l'état devient trop complexe pour `useState` (voir ci-dessous) |
| `Xxx.skeleton.tsx` | Rendu de chargement dédié                             | quand le `Skeleton` antd par défaut ne suffit pas                    |
| `Xxx.columns.tsx`  | Colonnes d'un `Table` antd                            | quand la définition des colonnes est longue                          |
| `Xxx.type.ts`      | Types partagés entre ces fichiers                     | quand plusieurs satellites partagent un type                         |

Ne pas créer de satellite vide. ⚠️ Trois `.style.tsx` vides existent.

### Extraire la logique : `.utils.tsx` ou hook ?

- **Sans hook** (une donnée en entrée, une donnée en sortie) : à mettre dans `Xxx.utils.tsx`. Ces fonctions sont
  faciles à tester et à réutiliser. Si une 2ᵉ page en a besoin, elles passent dans `src/utils/`.
- **Avec des hooks** (state, effet, query, contexte) : à mettre dans un **hook personnalisé** `hooks/useXxx.ts`. Les
  hooks servent à partager de la logique _avec état_. Voir
  [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).
- **Repère** : un composant de plus de ~150 lignes, ou dont le JSX n'est plus lisible d'un coup d'œil, doit être
  découpé en sous-composants, utilitaires ou hook.

### Passer à un `.reducer.tsx`

React recommande `useReducer` quand la logique de mise à jour devient difficile à suivre. Voir
[Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer). Dans ce
projet, on y passe quand :

- le composant a **au moins 4 `useState`** qui évoluent ensemble ;
- ou un changement d'état en déclenche un autre ;
- ou plusieurs handlers modifient les mêmes états.

```tsx
// MatchFilters.reducer.tsx
export type MatchFiltersState = { page: number; playerIds: string[]; dateOrder: 'ascend' | 'descend' };
export type MatchFiltersAction = { type: 'selectPlayers'; playerIds: string[] } | { type: 'changePage'; page: number };

export const initialMatchFiltersState: MatchFiltersState = { page: 0, playerIds: [], dateOrder: 'descend' };

export const matchFiltersReducer = (state: MatchFiltersState, action: MatchFiltersAction): MatchFiltersState => {
    switch (action.type) {
        case 'selectPlayers':
            return { ...state, playerIds: action.playerIds, page: 0 };
        case 'changePage':
            return { ...state, page: action.page };
    }
};

// MatchFilters.tsx
const [state, dispatch] = useReducer(matchFiltersReducer, initialMatchFiltersState);
```

Le reducer est une fonction **pure** : pas d'appel API, pas de `localStorage`, pas de mutation de `state`.
