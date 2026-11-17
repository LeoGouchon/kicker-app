# Données serveur : HTTP et cache

Comment un composant obtient ou modifie des données de l'API : client axios, intercepteurs, TanStack Query et mode mock.

## Fichiers clés

- `src/auth/http.ts` : instance axios, intercepteurs bearer et 401, choix réel ou mock.
- `src/utils/api.ts` : ré-export de `api`, le point d'import pour tous les hooks.
- `src/main.tsx` : `new QueryClient()` (options par défaut).
- `src/hooks/useApiEndPoint/use<Resource>.ts` : un fichier de hooks par ressource (`useMatch`, `usePlayer`,
  `useStats`, `useKickerMatchAccessCode`…).
- `src/types/<Name>.type.ts` : types des réponses et payloads.

## Client HTTP

Une seule instance axios, `realApi`, avec `baseURL: import.meta.env.VITE_API_URL` :

- **Requête** : ajoute `Authorization: Bearer <access_token>` si un utilisateur OIDC valide est stocké. L'en-tête
  n'est pas ajouté pour les URL de l'identity server ni avec l'option `skipAuth`.
- **Réponse 401** :
    - un seul retry, après `refreshAccessToken()` ;
    - ce refresh est partagé : des 401 simultanés attendent le même `signinSilent()` ;
    - si le refresh échoue, `logout()` redirige vers l'identity server.
    - L'option `skipAuthRefresh: true` désactive ce comportement, par exemple pour la création de match publique
      (`useCreatePublicMatch`).
- Options personnalisées déclarées par augmentation de module :
  `declare module 'axios' { interface AxiosRequestConfig { skipAuthRefresh?; skipAuth?; _authRetry? } }`.

```ts
export const api = import.meta.env.VITE_MOCK_API === 'true' ? mockApi : realApi;
```

## TanStack Query

- **Configuration** : le `QueryClient` est créé sans options. Valeurs par défaut de la librairie :
    - `staleTime: 0` ;
    - 3 retries ;
    - refetch au focus de la fenêtre.
- **Ajustements par hook** :
    - les matchs ont `staleTime` 1 min et `placeholderData: keepPreviousData` (pagination fluide) ;
    - la matrice de score a `staleTime` 1 h.
- **Hooks** : `useGet<X>` (lecture), `useCreate<X>` / `useDelete<X>` / `useRevoke<X>` (mutations), plus
  `useGetInfiniteMatches` (`useInfiniteQuery`).
- **Query keys** : tableaux plats commençant par le nom de la ressource en kebab-case (`['matches', page, size, …]`,
  `['player-stats', playerId]`). Seul `useKickerMatchAccessCode.ts` partage une constante
  (`['admin', 'kicker-match-codes']`). La convention cible est décrite dans
  [../conventions/api-hooks.md](../conventions/api-hooks.md).
- **Invalidation** : dans le `onSuccess` du hook de mutation. Par exemple, créer ou supprimer un match invalide
  `['matches']`. Le feedback utilisateur (message, reset du formulaire) se fait dans le composant via
  `mutate(vars, { onSuccess, onError })`.

### Parcours d'un GET (carte « Historique » du dashboard)

1. `HistorySummaryCard` appelle `useGetMatches({ page: 0, size: 3, dateOrder: 'descend' })`.
2. Clé `['matches', 0, 3, 'descend', undefined, undefined, undefined]`, requête
   `GET /kicker/matches?page=0&size=3&dateOrder=descend`.
3. L'intercepteur ajoute le bearer ; en cas de 401 il rafraîchit le token puis rejoue la requête une fois.
4. La query résout un `Pagination<Match>`. Le composant affiche `Skeleton` pendant le chargement, `Empty` si la liste
   est vide, sinon la liste de `MatchLine`.

### Parcours d'une mutation (codes d'accès admin)

1. `KickerMatchCodes` construit un `CreateKickerMatchAccessCodePayload` depuis le formulaire, avec des dates Dayjs
   converties en epoch ms.
2. `createCode.mutate(payload, { onSuccess: () => { form.resetFields(); message.success(…) }, onError: … })`.
3. Le hook fait `api.post('/admin/kicker-match-codes', payload)`, puis son `onSuccess` invalide la clé partagée.
4. `useGetKickerMatchAccessCodes` refetch et le tableau se met à jour. Le bouton affiche
   `loading={createCode.isPending}`.

## Mode mock (`VITE_MOCK_API=true`)

`src/utils/mockApi.ts` remplace l'instance axios par des réponses en dur, choisies par préfixe d'URL (fichiers dans
`src/utils/mockApiResponse/`). **Il n'est pas utilisable en l'état** :

- les réponses sont enveloppées deux fois dans `data` ;
- plusieurs endpoints n'ont pas de mock (toutes les stats, les invitations) ;
- l'identity server reste requis, car `config.ts` lève une erreur sans les variables OIDC et `/me` n'est appelé
  qu'avec un utilisateur OIDC réel.

Ajouter un mock pour un nouvel endpoint n'est donc pas exigé pour l'instant (voir [../tech-debt.md](../tech-debt.md)).
