# Release

Livrer en production le contenu de `dev`, via une PR `dev` → `main`.

## Fichiers clés

- `vercel.json` : réécrit toutes les URL vers `/` pour que le routing SPA fonctionne au rechargement.
- `src/utils/envChoice.ts` : `VITE_MODE=dev` affiche le tag « Dev mode » dans le header, sinon « Current live! ».

> L'hébergement est sur Vercel. La configuration des environnements (branches déployées, variables `VITE_*` par
> environnement) se trouve dans le tableau de bord Vercel, pas dans le dépôt. Toute variable ajoutée au code doit
> aussi être déclarée là-bas.

## Préparer

- [ ] `dev` contient uniquement des PR mergées et vérifiées, sans travail en cours.
- [ ] Sur `dev` à jour : `npm ci && npm run lint && npm run build` passent.
- [ ] `npm audit --audit-level=high` sort sans erreur (aucune vulnérabilité haute ou critique).
- [ ] Test rapide des parcours principaux sur `dev` :
    - connexion / déconnexion ;
    - nouveau match (connecté et public avec code) ;
    - historique, classement, page joueur, duo ;
    - écrans d'administration.
- [ ] Nouvelles variables d'environnement déclarées dans Vercel pour la production.
- [ ] Changement côté identity server ou API requis ? → le déployer **avant** le front.

## Ouvrir la PR

- **Base et source** : base `main`, source `dev`.
- **Titre** : `chore(release): <AAAA-MM-JJ>`.
- **Description** : la liste des PR incluses depuis la dernière release (titres Conventional Commits), regroupées par
  type (`feat`, `fix`, autres).

```bash
gh pr create --base main --head dev --title "chore(release): 2026-11-11"
```

## Merger

- **Merge commit**, pas de squash : `main` reste un ancêtre de `dev`, et les releases suivantes ne génèrent pas de
  conflits artificiels.
- Ne jamais committer directement sur `main`. Un correctif urgent passe par une branche `fix/…` depuis `dev`, puis par
  une release.

## Après le déploiement

- [ ] Vérifier la production : chargement, connexion, une lecture et une écriture.
- [ ] Recharger une URL profonde (ex. `/player/<uuid>`) : pas de 404.
- [ ] En cas de régression : revert de la PR fautive sur `dev`, puis nouvelle release. Pour un retour immédiat, le
      tableau de bord Vercel permet de re-promouvoir le déploiement précédent.
