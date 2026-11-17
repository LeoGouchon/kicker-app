# Hooks API (TanStack Query)

Comment déclarer et consommer un appel API. Ces règles s'appuient sur la documentation officielle de
[TanStack Query v5](https://tanstack.com/query/latest/docs/framework/react/overview).

## Fichiers clés

- `src/hooks/useApiEndPoint/use<Resource>.ts` : emplacement actuel (cible : `src/hooks/api/`, voir
  [project-structure.md](project-structure.md)).
- `src/hooks/useApiEndPoint/useKickerMatchAccessCode.ts` : le hook le plus proche de la convention (clé partagée,
  invalidation, typage).
- `src/utils/api.ts` : instance `api` à importer, jamais `axios` directement.

## Un fichier par ressource

- `src/hooks/api/use<Resource>.ts` regroupe la **fabrique de clés**, les queries et les mutations de la ressource.
- **Nommage** :
    - lectures : `useGet<Resource>` / `useGet<Resources>` ;
    - mutations : `useCreate<X>`, `useUpdate<X>`, `useDelete<X>`, ou un verbe métier (`useRevoke<X>`, `useResetElo`).
- Les hooks ne sont pas appelés ailleurs que dans des composants ou d'autres hooks.

## Query keys : une fabrique par ressource

La clé identifie la donnée en cache. Elle doit contenir **toutes les variables dont dépend la `queryFn`** (voir
[Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)). On la construit avec une
fabrique hiérarchique, ce qui permet d'invalider large (`all`) ou précis (`detail`) :

```ts
export const matchKeys = {
    all: ['matches'] as const,
    lists: () => [...matchKeys.all, 'list'] as const,
    list: (params: MatchListParams) => [...matchKeys.lists(), params] as const,
    details: () => [...matchKeys.all, 'detail'] as const,
    detail: (id: string) => [...matchKeys.details(), id] as const,
};
```

- **Pas de clé écrite à la main** dans un composant ou un autre hook : on passe par la fabrique. ⚠️ Les clés
  actuelles sont des tableaux inline. `useGetInfiniteMatches` oublie `playerFilter`.
- **Paramètres** : un objet dans la clé (`matchKeys.list(params)`) plutôt qu'une suite positionnelle.

## Query

```ts
export const useGetMatches = (params: MatchListParams) =>
    useQuery({
        queryKey: matchKeys.list(params),
        queryFn: async (): Promise<Pagination<Match>> => {
            const { data } = await api.get('/kicker/matches', {
                params,
                paramsSerializer: { indexes: null }, // tableaux au format Spring : playerIds=a&playerIds=b
            });
            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });
```

- **Typage** : type de retour explicite de la `queryFn` (`Promise<T>`), sans générique sur `useQuery`. Le DTO vient de
  `src/types/`.
- **Query string** : via l'option axios `params`, jamais par concaténation de chaînes.
  ⚠️ Toutes les URL actuelles sont construites à la main.
- **Pas de `try/catch` + `console.error`** dans la `queryFn` ou la `mutationFn` : l'erreur remonte dans
  `error` / `isError` et est affichée par le composant. ⚠️ `useMatch`, `usePlayer` et `useTeam` le font.
- **`staleTime`** : à fixer quand la donnée change rarement (stats, matrice), sinon on garde le défaut.
- **`placeholderData: keepPreviousData`** : pour la pagination et les filtres, afin d'éviter le clignotement.
- **`select`** : pour transformer la réponse. Il doit être **pur** : `[...data].sort()`, jamais `data.sort()`, qui
  modifie le cache. `toSorted()` n'est pas disponible avec `lib: ES2022`. ⚠️ `useGetSeasonsStats` trie le cache en
  place.
- **Requête dépendante** : utiliser `enabled: Boolean(id)` plutôt qu'une assertion `id!`.
- **Options réutilisées** : si la même query sert à plusieurs endroits (prefetch, `useQueries`), l'extraire avec
  [`queryOptions`](https://tanstack.com/query/latest/docs/framework/react/guides/query-options).

## Mutation

```ts
export const useDeleteMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`/kicker/matches/${id}`);
        },
        onSuccess: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: matchKeys.all }),
                queryClient.invalidateQueries({ queryKey: statsKeys.all }),
            ]),
    });
};
```

- **Invalidation** : dans le `onSuccess` **du hook**. Retourner la promesse pour que `isPending` dure jusqu'au
  refetch (voir
  [Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)).
- **Données dérivées** : invalider aussi ce qui dépend de la donnée modifiée. Un match créé ou supprimé change les
  stats et les ELO. ⚠️ Aujourd'hui, seules les clés `matches` sont invalidées.
- **Feedback UI** (message, reset de formulaire, navigation) : dans le **composant**, via
  `mutate(variables, { onSuccess, onError })`. Voir [ui-feedback.md](ui-feedback.md).
- **`setQueryData`** (mise à jour manuelle du cache) : seulement si un refetch est coûteux, avec un commentaire.
  L'invalidation reste la règle.

## Dans le composant

- **États de la query** : lire `data`, `isPending` / `isLoading`, `isError`, `refetch` ; pour les mutations,
  `isPending` et `variables`.
- **Ne pas recopier `data`** dans un `useState`. Le dériver pendant le rendu.
- **Ne pas appeler `api` directement** dans un composant ou un contexte : on passe par un hook.
  ⚠️ `UserContext` appelle `api.get('/me')` directement.

## Types d'API

- **Fichier** : `src/types/<Name>.type.ts`, avec un `type` par DTO (pas d'`interface`), nommé comme la ressource
  (`Match`, `Player`).
- **Payload de requête** : `Create<X>Payload` / `Update<X>Payload` dans le même fichier. Pas de type de payload défini
  dans un hook ou un composant (⚠️ `CreateMatchPayload` dans `useMatch.ts`, `MatchPayload` dans `MatchForm.tsx`).
- **Champs** : nommés comme l'API les renvoie. La transformation pour l'UI se fait dans `select` ou dans un
  `.utils.tsx`.

## Mode mock

Il n'est pas maintenu (voir [../architecture/data-fetching.md](../architecture/data-fetching.md)). Un nouvel endpoint
n'a pas besoin de mock tant que ce mode n'est pas réparé.

## Outils recommandés

[`@tanstack/eslint-plugin-query`](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query) détecte les clés
incomplètes (`exhaustive-deps`). Il n'est pas encore installé (voir [../tech-debt.md](../tech-debt.md)).
