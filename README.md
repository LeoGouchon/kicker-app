# Kicker-App

SPA React + TypeScript + Vite. L’authentification est déléguée à l’identity server via `oidc-client-ts` et Authorization
Code + PKCE (S256).

## Configuration

Vite n’expose au navigateur que les variables préfixées `VITE_`. Les variables applicatives correspondent donc aux noms
demandés avec ce préfixe :

```dotenv
VITE_API_URL=http://localhost:8080/api/v1
VITE_IDENTITY_ISSUER=http://localhost:8081
VITE_IDENTITY_CLIENT_ID=kicker-client
VITE_IDENTITY_REDIRECT_URI=http://localhost:5173/
VITE_IDENTITY_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_IDENTITY_RESOURCE=default-api
VITE_IDENTITY_SCOPE=openid profile email
```

Les tokens sont gérés par `oidc-client-ts` en `localStorage` afin de conserver la session entre les onglets et après
la réouverture du navigateur, l’
`id_token` n’est jamais envoyé à Hubscore et seul l’`access_token` est utilisé dans `Authorization: Bearer`. Le
renouvellement silencieux est automatique 60 secondes avant expiration via le refresh token ; sa rotation est gérée par
la librairie. En cas d’échec, la session est révoquée/nettoyée et l’utilisateur est redirigé vers le logout de
l’identity server.

## Identity server

La configuration OAuth doit autoriser exactement `http://localhost:5173/` pour les redirections de connexion et de
déconnexion de `kicker-client` (et les URL équivalente de chaque environnement). L’identity server doit aussi autoriser
l’origine de l’application dans sa configuration CORS.

Le backend fourni expose bien la découverte, les endpoints d’autorisation/token/logout et les clés JWKS. Son endpoint de
révocation n’étant pas dans le document de découverte, l’adaptateur `src/auth/client.ts` appelle explicitement
`/oauth2/revoke`.

La configuration backend doit déclarer le client `kicker-client`, en cohérence avec `VITE_IDENTITY_CLIENT_ID`.

`oidc-client-ts` génère state et PKCE S256. Comme le provider impose aussi `nonce` alors que le flux code seul de la
librairie ne l’ajoute pas automatiquement, l’adaptateur génère un nonce aléatoire avec Web Crypto et le fournit à la
librairie.

## Commandes

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
npm test
npm run lint
npm run build
```

L’identity server et l’API Hubscore doivent être démarrés séparément selon leurs README backend, avec leurs ports locaux
(`8081` et `8080`).

## Organisation OAuth

- `src/auth/client.ts` : adaptateur `oidc-client-ts`, découverte, révocation et logout.
- `src/auth/http.ts` : bearer sur les appels API, refresh coordonné, un seul retry après 401.
- `src/auth/config.ts` : configuration par environnement.
- `src/modules/auth/AuthCallbackPage.tsx` : callback et restauration d’URL interne.

Les permissions d’administration affichées par le frontend restent indicatives ; l’autorisation réelle est vérifiée par
l’API.
