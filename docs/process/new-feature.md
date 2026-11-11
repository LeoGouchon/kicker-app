# Développer une nouvelle feature

Le parcours complet, du besoin au merge dans `dev`. Chaque étape renvoie vers la doc qui détaille les règles.
Coche mentalement chaque case : une case sautée finit en dette.

## 1. Cadrer

- [ ] Reformuler le besoin en une ou deux phrases : quel écran, pour quel rôle (anonyme, user, modérateur, admin).
- [ ] Lister les endpoints API nécessaires et vérifier qu'ils existent côté backend (contrat, droits).
- [ ] Repérer l'existant réutilisable : `src/components/`, `src/hooks/`, `src/utils/`, types de `src/types/`.
- [ ] Une décision structurante (nouvelle librairie, nouveau pattern, changement d'architecture) ? → rédiger un ADR
      dans [../decisions/](../decisions/README.md) **avant** de coder.
- [ ] Avec Claude Code : travailler en **mode plan** pour les features de plus de quelques fichiers. Valider le plan
      avant l'implémentation.

## 2. Créer la branche

```bash
git switch dev && git pull
git switch -c feat/<description-kebab>
```

Convention : [../conventions/git-workflow.md](../conventions/git-workflow.md).

## 3. Implémenter, dans cet ordre

1. **Types** : DTO et payloads dans `src/types/<Name>.type.ts`.
2. **Hooks API** : fabrique de clés, queries, mutations et invalidation dans `src/hooks/api/use<Resource>.ts`. Voir
   [add-an-endpoint.md](add-an-endpoint.md).
3. **Page** :
    - créer `src/pages/<page-kebab>/` avec le composant, `.style.tsx` et, si besoin, `.utils.tsx` / `.reducer.tsx` ;
    - ajouter la route, le breadcrumb et le menu ;
    - voir [add-a-page.md](add-a-page.md).
4. **Sous-composants** dans `components/` de la page. Ce qui sert à une 2ᵉ page va dans `src/components/`.
5. **Permissions** :
    - `WithProtectionRoute` (avec `isAdminRestricted` si besoin) ;
    - les boutons et les entrées de menu sont masqués avec `src/utils/roles.ts` ;
    - le backend reste l'unique garant.
6. **États UI** : erreur, chargement et vide sur chaque query ; feedback et confirmation sur chaque mutation. Voir
   [../conventions/ui-feedback.md](../conventions/ui-feedback.md).

Pendant l'implémentation, respecter :

- [code-style.md](../conventions/code-style.md) ;
- [components.md](../conventions/components.md) ;
- [styling.md](../conventions/styling.md).

## 4. Vérifier

- [ ] `npm run lint` passe sans erreur.
- [ ] `npm run build` passe : c'est la vérification TypeScript de référence.
- [ ] Test manuel dans `make dev` :
    - [ ] desktop **et** mobile (fenêtre sous le breakpoint `md`) ;
    - [ ] thème clair **et** sombre ;
    - [ ] chaque rôle concerné : anonyme, user, modérateur, admin ;
    - [ ] états chargement, vide et erreur (couper l'API ou simuler une erreur réseau dans les DevTools) ;
    - [ ] navigation : breadcrumb, menu actif, bouton retour du navigateur, rechargement de la page sur l'URL.
- [ ] Aucun nouveau `React.*`, `style={{}}`, couleur en dur, `any` ou `console.log`.

## 5. Documenter

- [ ] Nouvelle convention ou convention modifiée → mettre à jour `docs/conventions/`.
- [ ] Nouveau mécanisme transverse → mettre à jour ou créer un fichier dans `docs/architecture/`.
- [ ] Nouvelle variable d'environnement → `.env.example`, `src/vite-env.d.ts`,
      [../getting-started.md](../getting-started.md).
- [ ] Dette repérée mais non traitée → l'ajouter à [../tech-debt.md](../tech-debt.md).
- [ ] Dette traitée au passage → la retirer de [../tech-debt.md](../tech-debt.md).
- [ ] Chaque fichier touché reste sous 200 lignes (ou l'exception est assumée dans
      `.claude/hooks/doc-length-ignore.txt`), et chaque nouveau fichier est ajouté au sommaire de son dossier.

## 6. Proposer

- [ ] Commits au format Conventional Commits.
- [ ] PR vers `dev` avec le template rempli. Suivre [pull-request.md](pull-request.md).
- [ ] Avec Claude Code : lancer `/code-review` sur la branche avant de demander une relecture humaine.
