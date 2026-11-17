# 0002. Authentification OIDC avec `oidc-client-ts`

- **Statut** : Accepté
- **Date** : 2026-08-21 (PR #25, formalisé le 2026-11-11)

## Contexte

L'authentification était gérée par le backend applicatif. Elle a été déléguée à un identity server dédié, qui expose
un fournisseur OAuth 2 / OIDC. Une SPA ne peut pas garder de secret client. Elle doit donc utiliser un flux adapté
aux clients publics et gérer elle-même le cycle de vie des tokens.

## Options envisagées

1. **Implicit flow** : déconseillé par les bonnes pratiques OAuth actuelles (token exposé dans l'URL).
2. **Backend-for-frontend** (session cookie côté serveur) : plus sûr, mais impose un serveur que le projet n'a pas
   (hébergement statique Vercel).
3. **Authorization Code + PKCE dans la SPA**, via une librairie standard.

## Décision

Nous utilisons l'option 3, avec `oidc-client-ts` :

- **Flux** : Authorization Code + PKCE S256. Le `state` est géré par la librairie. Le nonce est ajouté par
  l'adaptateur (`src/auth/client.ts`), car le provider l'exige.
- **Stockage** : l'utilisateur OIDC est stocké en `localStorage`, pour conserver la session entre onglets et après la
  réouverture du navigateur.
- **Renouvellement** : silencieux 60 s avant expiration, via le refresh token.
- **Échec du renouvellement** : un 401 déclenche un refresh coordonné et un seul retry ; si le refresh échoue, logout.
- **Usage des tokens** : seul l'`access_token` est envoyé à l'API. Au logout, le refresh token est révoqué
  explicitement (`/oauth2/revoke`).

## Conséquences

- **Positives** :
    - pas de serveur à maintenir ;
    - librairie éprouvée pour le PKCE et le renouvellement ;
    - session persistante.
- **Négatives** :
    - les tokens en `localStorage` sont accessibles à un script injecté : la prévention XSS (pas de `innerHTML` /
      `dangerouslySetInnerHTML`, dépendances à jour) est critique ;
    - l'identity server doit déclarer exactement les redirect URI de chaque environnement, et le port 5173 est imposé
      en local.
- **Suivi** : deux mécanismes de callback coexistent (`AppContent.tsx` et les routes `/auth/*`). Voir `tech-debt.md`.
  Le détail du fonctionnement est dans `architecture/auth.md`.
