# Routing, permissions et navigation

Comment une URL devient une page : déclaration, protection, breadcrumb et menu.

## Fichiers clés

- `src/routes/constant.ts` : objet `ROUTES` (chemins) et type `Route`.
- `src/routes/index.tsx` : tableau `routes` (`AppRouteObject[]`), `breadcrumbRoutes` et `uuidRegex`.
- `src/components/withProtectionRoute/WithProtectionRoute.tsx` : garde d'authentification et de rôle.
- `src/utils/roles.ts` : `hasRole`, `hasAnyRole`, `isAdmin`, `isModeratorOrAdmin`.
- `src/hooks/useMenuItems.tsx` : entrées du menu (Sider desktop et Drawer mobile).
- `src/components/breadcrumb/AppBreadcrumb.tsx` : fil d'Ariane.

## Déclaration des routes

Les chemins sont centralisés dans `ROUTES` (clés en `SCREAMING_SNAKE_CASE`, chemins en kebab-case, pages
d'administration sous `/admin/...`) :

```ts
export const ROUTES = { HISTORY: '/history', KICKER_MATCH_CODES: '/admin/kicker-match-codes' /* … */ } as const;
```

`routes/index.tsx` associe chaque chemin à un élément et, si la page apparaît dans le fil d'Ariane, à un `breadcrumb` :

```tsx
{
    path: ROUTES.KICKER_MATCH_CODES,
    element: (
        <WithProtectionRoute isAdminRestricted>
            <KickerMatchCodes />
        </WithProtectionRoute>
    ),
    breadcrumb: { label: 'Codes matchs', parents: [{ label: 'Admin' }] },
},
```

- Le tableau est passé à `useRoutes(routes)` dans `AppContent.tsx`. Les pages sont importées statiquement (pas de
  lazy loading).
- Paramètres : `${ROUTES.PLAYER}/:uuid` (validé dans la page avec `uuidRegex`) et `${ROUTES.RANKING}/*` (sous-chemins
  année/trimestre analysés à la main dans `MainStats`).
- `ROUTES.NOT_FOUND` (`*`) attrape toutes les URL inconnues.

## Protection

`WithProtectionRoute` enveloppe l'élément d'une route privée :

| `authState` (UserContext)                          | Rendu                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| `initializing`                                     | `Spin` « Vérification de la connexion… »                                    |
| `anonymous` ou pas d'utilisateur                   | `Result` « Connexion requise » avec un bouton qui appelle `login(returnTo)` |
| `authenticated` + `isAdminRestricted` sans le rôle | `Result` 403                                                                |
| sinon                                              | la page                                                                     |

`isAdminRestricted` vérifie **`isModeratorOrAdmin`** : les modérateurs y ont accès (voir l'incohérence avec le menu
dans [../tech-debt.md](../tech-debt.md)).

Rôles disponibles : `UserRole` dans `src/types/User.type.ts` (`ADMIN`, `MODERATOR`, `USER`). Les permissions du
frontend sont **indicatives** : l'API vérifie les droits réels.

## Breadcrumb

`breadcrumbRoutes` est dérivé de `routes` : seules les routes avec un `breadcrumb` y figurent. `AppBreadcrumb`
utilise `matchPath` pour trouver la route courante. Il commence toujours par « Accueil », ajoute les `parents` puis le
`label`, et affiche « Page introuvable » si rien ne correspond.

## Menu

`useGetMenuItemElements()` construit les items antd `Menu` avec `getItem(label, key, icon, onClick, disabled)` :

- la clé est le chemin (`ROUTES.X`) ;
- l'icône est un `FontAwesomeIcon` ;
- un item réservé à un rôle est ajouté par décomposition conditionnelle :
  `...(isModeratorOrAdmin(user) ? [getItem(...)] : [])`.

Sélection de l'item actif :

- `Sider.tsx` fait une correspondance par préfixe de chemin, avec un cas particulier `PUBLIC_NEW_MATCH` →
  `NEW_MATCH` ;
- le Drawer mobile du `Header` compare le chemin exact.

Les libellés sont dupliqués entre le menu et le breadcrumb : en changer un oblige à changer l'autre.

## Pages plein écran

Les pages sans Sider, Header et Breadcrumb sont listées en dur dans `AppContent.tsx` (`AUTH_CALLBACK`,
`AUTH_LOGOUT_CALLBACK`, `INVITE`). Elles utilisent en général `src/components/fullscreenPage/FullscreenPage.tsx`.
Ajouter une page de ce type demande de compléter cette liste.

Pas-à-pas pour ajouter une page : [../process/add-a-page.md](../process/add-a-page.md).
