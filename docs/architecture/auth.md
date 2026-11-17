# Authentification et session

L'authentification est déléguée à l'identity server via `oidc-client-ts` (Authorization Code + PKCE S256). Ce
fichier décrit le flux, la session côté front et les rôles.

## Fichiers clés

- `src/auth/config.ts` : `identityConfig`, construit depuis les variables `VITE_IDENTITY_*` (erreur si absente).
- `src/auth/client.ts` : `UserManager` OIDC, `login`, `logout`, callbacks, refresh, révocation.
- `src/auth/http.ts` : bearer sur les appels API, refresh coordonné, un seul retry après 401.
- `src/auth/returnTo.ts` : n'accepte comme URL de retour qu'un chemin interne (`/…`, pas `//…`).
- `src/auth/types.ts` : `AuthState = 'initializing' | 'authenticated' | 'anonymous' | 'error'`.
- `src/context/UserContext.tsx` : utilisateur applicatif (`/me`) et état d'authentification.
- `src/AppContent.tsx` et `src/modules/auth/*CallbackPage.tsx` : traitement des retours de l'identity server.

## Flux de connexion

1. `login(returnTo)` est appelé depuis le bouton « Se connecter » du `Header` ou de `WithProtectionRoute`. Il assainit
   l'URL de retour (même origine uniquement), génère un **nonce** et redirige avec `prompt: 'login'`.
2. Le `state` et le PKCE S256 sont générés par `oidc-client-ts`. Le provider exige un `nonce` que le flux code de la
   librairie n'ajoute pas : l'adaptateur le génère avec Web Crypto et le fournit.
3. Au retour sur `/?code=…`, `AppContent` détecte le paramètre `code`, appelle `handleCallback()`, affiche une
   notification de progression, puis navigue vers le `returnTo` contenu dans le `state`.
4. `UserContext` reçoit l'événement `userLoaded`, appelle `GET /me` et passe en `authenticated`.

`handleCallback` partage une seule promesse : le code d'autorisation est à usage unique, et `StrictMode` monte le
composant deux fois en développement.

## Session

- **Stockage** : le user OIDC est stocké en `localStorage` (`WebStorageStateStore`), ce qui conserve la session entre
  onglets et après réouverture du navigateur. Les autres onglets sont synchronisés via l'événement `storage`.
- **Tokens** : seul l'`access_token` est envoyé à l'API (`Authorization: Bearer`). L'`id_token` n'est jamais envoyé
  à Hubscore.
- **Renouvellement** : silencieux et automatique 60 s avant expiration via le refresh token. Sa rotation est gérée
  par la librairie.
- **Échec du renouvellement** : sur `accessTokenExpired` ou un refresh en échec après un 401, la session est
  nettoyée et l'utilisateur est redirigé vers le logout de l'identity server.

## Déconnexion

`logout()` :

- révoque le refresh token (`POST /oauth2/revoke`, appelé explicitement car cet endpoint n'est pas dans le document
  de découverte) ;
- puis appelle `signoutRedirect`.

Au retour (`?state=…` sans `code`), `AppContent` appelle `handleLogoutCallback()` et `clearSession()`.

> Deux mécanismes coexistent pour les callbacks : `AppContent.tsx` (utilisé, car les redirect URI pointent sur `/`) et
> les routes `/auth/callback` / `/auth/logout-callback`. Voir [../tech-debt.md](../tech-debt.md).

## `UserContext`

- **Valeur** : `{ user?: UserType, authState, setUser, clearSession }`, consommée par `useContext(UserContext)`.
- **Au montage** : `loadCurrentProfile()` récupère l'utilisateur OIDC, le rafraîchit s'il a expiré, puis appelle
  `api.get('/me')`.
- **Appels simultanés** : ils partagent la même promesse (`currentProfilePromise`).

## Rôles et permissions

- `UserType.role` vaut `'ADMIN' | 'MODERATOR' | 'USER'` (objet `UserRole` dans `src/types/User.type.ts`).
- Les helpers de `src/utils/roles.ts` acceptent un utilisateur `null | undefined` :
    - `hasRole`, `hasAnyRole` ;
    - `isAdmin`, `isModeratorOrAdmin`.
- **Où les rôles agissent** :
    - routes : `WithProtectionRoute isAdminRestricted` (modérateur ou admin) ;
    - menu : `useMenuItems.tsx` ;
    - actions : boutons du popover utilisateur (`Logged.tsx`), suppression de match (`MatchCard.tsx`).
- **Les permissions affichées par le frontend sont indicatives** : l'autorisation réelle est vérifiée par l'API.
  Un bouton masqué n'est jamais une sécurité.

## Configuration côté identity server

- Le client `kicker-client` doit correspondre à `VITE_IDENTITY_CLIENT_ID`.
- Il doit autoriser exactement les redirect URI de connexion et de déconnexion de chaque environnement
  (`http://localhost:5173/` en local).
- L'origine de l'application doit être autorisée en CORS.
- Le backend expose la découverte, les endpoints authorize, token et logout, et les clés JWKS.

Décision et alternatives : [../decisions/0002-authentification-oidc.md](../decisions/0002-authentification-oidc.md).
