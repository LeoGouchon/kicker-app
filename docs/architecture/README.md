# Architecture

**Visée** : décrire comment le code fonctionne **aujourd'hui** : flux, responsabilités et fichiers qui font foi.
Ce dossier ne fixe pas de règles (c'est le rôle de [conventions/](../conventions/README.md)). Il explique ce qui
existe, pour qu'on puisse le modifier sans le casser.

**Quand ajouter un fichier ici** : quand un mécanisme transverse (utilisé par plusieurs pages) mérite une
explication, par exemple un nouveau provider, un système de cache ou une intégration externe. Une feature isolée n'a
pas sa place ici.

## Sommaire

- [overview.md](overview.md) : stack, arbre des providers, rôle de chaque dossier de `src/`, flux d'une donnée.
  _À lire si_ : tu découvres le projet ou tu cherches où se trouve quelque chose.
- [routing.md](routing.md) : déclaration des routes, protection par rôle, breadcrumb, menu latéral, pages plein écran.
  _À lire si_ : tu ajoutes ou modifies une page, une entrée de menu ou une permission.
- [data-fetching.md](data-fetching.md) : client axios et intercepteurs, `QueryClient`, parcours d'un GET et d'une
  mutation, mode mock.
  _À lire si_ : tu touches à un appel API, au cache ou à la gestion des erreurs HTTP.
- [auth.md](auth.md) : flux OIDC (PKCE, nonce, refresh, révocation), `UserContext`, callbacks, rôles.
  _À lire si_ : tu modifies la connexion, la session, les rôles ou un écran réservé.
- [styling.md](styling.md) : `ThemeProvider`, tokens et variables CSS antd, emotion, responsive, icônes, graphiques,
  dates.
  _À lire si_ : tu modifies le thème, un style partagé, un graphique ou l'affichage des dates.
