# Pull request

Préparer, ouvrir, relire et merger une PR vers `dev`. Les règles de branches et de commits sont dans
[../conventions/git-workflow.md](../conventions/git-workflow.md).

## Avant d'ouvrir

- [ ] Branche à jour avec `dev` (`git fetch && git rebase origin/dev`). Conflits fréquents entre branches parallèles :
    - `docs/glossary.md`, sommaire des ADR, `docs/tech-debt.md` : garder les entrées des deux côtés ;
    - un ADR de la branche porte un numéro déjà pris dans `dev` : le renuméroter (nom du fichier, titre, sommaire,
      liens qui y pointent, y compris dans `specs/`).
- [ ] `npm run lint`, `npm run build` et `npm test` passent (la CI les relance, voir plus bas).
- [ ] Test manuel fait : desktop/mobile, clair/sombre, rôles, états chargement/vide/erreur (voir
      [new-feature.md](new-feature.md#4-vérifier)).
- [ ] Auto-relecture du diff complet (`git diff origin/dev...`) :
    - [ ] pas de fichier parasite, de `console.log`, de code commenté ;
    - [ ] pas de nouveau `React.*`, `style={{}}`, couleur en dur ou `any`.
- [ ] Doc mise à jour si une convention, un process ou l'architecture change. Chaque fichier reste sous 200 lignes,
      sauf exception assumée dans `.claude/hooks/doc-length-ignore.txt`.
- [ ] Avec Claude Code : revue faite et ses retours traités. Avec `/feature`, c'est la revue de la phase Vérifier
      (`specs/<feature>/4-verification.md`) ; sans `/feature`, ou si du code a changé depuis, `/code-review`.

## Ouvrir

- **Base** : `dev`. Jamais `main`, sauf pour la PR de release ([release.md](release.md)).
- **Titre** : au format Conventional Commits, en anglais, car il deviendra le message du commit squashé.
  Exemple : `feat(history): add filters by player`.
- **Description** : remplir `.github/pull_request_template.md` (résumé, plan de test, captures si l'UI change).
- **Taille** : viser une PR relisible en une fois. Au-delà de ~400 lignes de diff, sans compter les fichiers générés
  ni `specs/`, découper si possible (refactor préalable dans une PR à part, puis la feature).

```bash
gh pr create --base dev --title "feat(history): add filters by player" --body-file <fichier>
```

## CI

Le workflow `.github/workflows/ci.yml` tourne sur chaque PR vers `dev` et `main`, et à chaque nouveau push sur la
branche : `npm ci`, `npm run lint`, `npm run build`, `npm test`, avec la version de Node du champ `engines` de
`package.json`. Son check s'appelle **`Lint, build and test`**. Une fois requis par le ruleset de la branche cible (voir
ci-dessous), une PR rouge ne se merge plus.
Le pre-commit et le build Vercel ne lancent pas les tests.

**Rendre un check obligatoire** (réglage du dépôt, à faire une fois par check et par branche) :

1. Le workflow doit déjà être dans la branche cible et avoir tourné au moins une fois (`gh pr checks <n°>`). Sinon
   le check reste « en attente » et bloque toutes les PR.
2. Lire le ruleset de la branche : `gh api repos/LeoGouchon/kicker-app/rulesets` (`Protect main`, `Protect dev`).
3. Ajouter la règle avec `gh api -X PUT repos/LeoGouchon/kicker-app/rulesets/<id> --input <fichier.json>`, en
   renvoyant **toutes** les règles existantes plus celle-ci (sinon elles sont supprimées) :

```json
{
    "type": "required_status_checks",
    "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [{ "context": "Lint, build and test" }]
    }
}
```

Pour une branche sans ruleset, le créer avec `gh api -X POST repos/LeoGouchon/kicker-app/rulesets` (`target: branch`,
`enforcement: active`, `conditions.ref_name.include: ["refs/heads/<branche>"]`).

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
- **Si `dev` a bougé pendant la relecture** : rebaser, attendre que la CI repasse au vert, puis merger.
