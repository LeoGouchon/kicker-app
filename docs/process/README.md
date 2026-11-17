# Process

**Visée** : les recettes pas-à-pas pour livrer, sous forme de checklists actionnables. Elles disent **dans quel
ordre faire quoi** et renvoient vers [conventions/](../conventions/README.md) pour les règles, sans les répéter.

**Quand ajouter un fichier ici** : quand une tâche revient régulièrement et qu'elle a des étapes faciles à oublier
(migration, ajout d'une variable d'environnement, montée de version d'une dépendance majeure…).

## Sommaire

- [new-feature.md](new-feature.md) : le parcours complet d'une feature, du cadrage au merge, et son déroulé avec
  Claude Code (`/feature`).
  _À lire si_ : tu démarres une nouvelle feature ou une évolution significative. **Point d'entrée par défaut.**
- [add-a-page.md](add-a-page.md) : créer une page routée (dossier, route, breadcrumb, menu, protection), avec un
  squelette de code.
  _À lire si_ : ta tâche ajoute une nouvelle URL à l'application.
- [add-an-endpoint.md](add-an-endpoint.md) : brancher un nouvel endpoint API (type, fabrique de clés, hook,
  invalidation, consommation).
  _À lire si_ : ta tâche consomme un endpoint qui n'a pas encore de hook.
- [pull-request.md](pull-request.md) : préparer, ouvrir, relire et merger une PR vers `dev`.
  _À lire si_ : ton code est prêt à être proposé, ou tu relis la PR de quelqu'un.
- [release.md](release.md) : livrer `dev` en production via la PR vers `main`.
  _À lire si_ : tu prépares une mise en production.
