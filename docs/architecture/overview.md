# Vue d'ensemble

Stack, assemblage de l'application au démarrage et rôle de chaque dossier de `src/`.

## Fichiers clés

- `src/main.tsx` : point d'entrée ; `QueryClient`, `ThemeProvider` et enregistrement des modules chart.js.
- `src/App.tsx` : `BrowserRouter` et `UserProvider`.
- `src/AppContent.tsx` : layout (Sider, Header, Breadcrumb, Footer), `useRoutes` et callbacks OIDC.
- `src/routes/index.tsx` : table des routes.

## Stack

| Domaine          | Outil                                                                              |
| ---------------- | ---------------------------------------------------------------------------------- |
| UI               | React 19, antd 6 (`ConfigProvider`, `App`), emotion (`@emotion/styled`)            |
| Routing          | react-router-dom 7 (`BrowserRouter` + `useRoutes`)                                 |
| Données serveur  | TanStack Query 5 + axios                                                           |
| Authentification | `oidc-client-ts` (Authorization Code + PKCE)                                       |
| Graphiques       | chart.js 4 via `react-chartjs-2` (+ `chartjs-plugin-annotation`)                   |
| Icônes           | FontAwesome (`@fortawesome/react-fontawesome`)                                     |
| Build            | Vite 8, TypeScript 5.8 (strict)                                                    |
| Qualité          | ESLint 9, Prettier 3, husky + lint-staged                                          |
| Hébergement      | Vercel (`vercel.json` : réécriture de toutes les URL vers `/` pour le routing SPA) |

## Arbre des providers

```
<StrictMode>
  <QueryClientProvider client={new QueryClient()}>        main.tsx, options par défaut
    <ThemeProvider>                                        context/ThemeProvider.tsx
      <ConfigProvider theme={…} tag={…}>                    algorithme clair/sombre, cssVar
        <AntdApp>                                          contexte de App.useApp()
          <EmotionThemeProvider>
            <App>                                          App.tsx
              <BrowserRouter>
                <UserProvider>                             context/UserContext.tsx
                  <AppContent />                           layout et routes
```

`AppContent` rend deux layouts :

- **sans shell** pour `ROUTES.AUTH_CALLBACK`, `ROUTES.AUTH_LOGOUT_CALLBACK` et `ROUTES.INVITE` (liste en dur dans
  `AppContent.tsx`) ;
- **avec shell** pour tout le reste : `Sider` (desktop), `Header`, `AppBreadcrumb`, contenu routé et `Footer`, avec
  une largeur max de 1440 px.

## Rôle des dossiers de `src/`

| Dossier         | Contenu                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `auth/`         | Client OIDC, instance axios et intercepteurs, configuration d'environnement                    |
| `components/`   | Composants partagés entre pages (Header, Sider, Breadcrumb, `LinkPlayer`, `MatchLine`…)        |
| `context/`      | Contextes React globaux : thème (`ThemeProvider`), utilisateur (`UserContext`)                 |
| `hooks/`        | Hooks partagés. `useApiEndPoint/` regroupe les hooks TanStack Query (un fichier par ressource) |
| `modules/`      | Une page routée par dossier, avec ses sous-composants (cible : `pages/`, voir conventions)     |
| `routes/`       | `ROUTES` (chemins) et table des routes avec leur breadcrumb                                    |
| `types/`        | Types des DTO de l'API (`<Name>.type.ts`)                                                      |
| `utils/`        | Fonctions pures partagées (rôles, graphiques, saisons) et mode mock                            |
| `App.style.tsx` | Styles du layout et primitive partagée `FlexFullWidth`                                         |

## Flux d'une donnée

```
Composant de page ──► hook use<Resource> (src/hooks/useApiEndPoint)
                         │  useQuery / useMutation, query key
                         ▼
                      api (src/utils/api.ts → src/auth/http.ts)
                         │  intercepteur : Authorization: Bearer <access_token>
                         │  401 → refresh silencieux → 1 retry → sinon logout
                         ▼
                      API Hubscore (VITE_API_URL)
```

Le cache TanStack Query est la seule source d'état serveur. Il n'y a pas de store global. Le seul état client partagé
est le thème et l'utilisateur courant, plus quelques préférences en `localStorage`.

## Pour aller plus loin

- [routing.md](routing.md) : les routes, permissions et menu.
- [data-fetching.md](data-fetching.md) : le détail de la couche HTTP et du cache.
- [../conventions/project-structure.md](../conventions/project-structure.md) : l'organisation cible des dossiers.
