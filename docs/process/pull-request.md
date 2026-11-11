# Pull request

Préparer, ouvrir, relire et merger une PR vers `dev`. Les règles de branches et de commits sont dans
[../conventions/git-workflow.md](../conventions/git-workflow.md).

## Avant d'ouvrir

- [ ] Branche à jour avec `dev` (`git fetch && git rebase origin/dev`).
- [ ] `npm run lint` et `npm run build` passent.
- [ ] Test manuel fait : desktop/mobile, clair/sombre, rôles, états chargement/vide/erreur (voir
      [new-feature.md](new-feature.md#4-vérifier)).
- [ ] Auto-relecture du diff complet (`git diff origin/dev...`) :
    - [ ] pas de fichier parasite, de `console.log`, de code commenté ;
    - [ ] pas de nouveau `React.*`, `style={{}}`, couleur en dur ou `any`.
- [ ] Doc mise à jour si une convention, un process ou l'architecture change. Chaque fichier reste sous 200 lignes,
      sauf exception assumée dans `.claude/hooks/doc-length-ignore.txt`.
- [ ] Avec Claude Code : `/code-review` lancé et ses retours traités.

## Ouvrir

- **Base** : `dev`. Jamais `main`, sauf pour la PR de release ([release.md](release.md)).
- **Titre** : au format Conventional Commits, en anglais, car il deviendra le message du commit squashé.
  Exemple : `feat(history): add filters by player`.
- **Description** : remplir `.github/pull_request_template.md` (résumé, plan de test, captures si l'UI change).
- **Taille** : viser une PR relisible en une fois. Au-delà de ~400 lignes de diff hors fichiers générés, découper si
  possible (refactor préalable dans une PR à part, puis la feature).

```bash
gh pr create --base dev --title "feat(history): add filters by player" --body-file <fichier>
```

## Relire

Le relecteur vérifie, dans cet ordre :

1. **Comportement** : le besoin est couvert et le plan de test est crédible et reproductible.
2. **Permissions** : les rôles de la route, du menu et des boutons sont cohérents entre eux, et cohérents avec ce que
   l'API autorise.
3. **Données** :
    - query keys complètes, invalidations couvrant les données dérivées ;
    - erreurs affichées, pas de spinner infini.
4. **Conventions** : structure des dossiers, satellites `.style` / `.utils` / `.reducer`, nommage des composants
   stylés, imports.
5. **Dette** : la PR n'ajoute pas de nouvel écart listé dans [../tech-debt.md](../tech-debt.md), et retire ceux
   qu'elle corrige.

Commentaires : distinguer ce qui bloque (bug, faille, convention violée) de la suggestion (préfixe `nit:`).

## Merger

- **Mode** : **squash merge** dans `dev`, en gardant le titre de la PR comme message (GitHub ajoute `(#NN)`).
- **Après le merge** : supprimer la branche distante et locale.
- **Si `dev` a bougé pendant la relecture** : rebaser, relancer `npm run build`, puis merger.
