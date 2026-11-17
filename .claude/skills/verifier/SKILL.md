---
name: verifier
description: Phase 4 du workflow feature de kicker-app. Vérifie une feature implémentée avec des preuves fraîches (lint, build, tests), les critères d'acceptation du brief, une revue de code indépendante et un parcours dans le navigateur, reporte la dette dans docs/tech-debt.md et écrit specs/<feature>/4-verification.md. À utiliser quand l'implémentation est terminée, avant toute PR, ou quand l'utilisateur tape /verifier.
---

# Vérifier : des preuves avant d'affirmer

**Aucune affirmation de réussite sans preuve fraîche.** Si tu n'as pas lancé la commande dans cette phase et lu sa
sortie, tu ne peux pas dire qu'elle passe. « Ça devrait marcher », « le lint passe donc le build aussi », « le
sous-agent a dit que c'était bon » ne sont pas des preuves.

## 1. Prérequis

- `1-brief.md`, `2-plan.md` et `3-execution.md` existent dans `specs/<feature>/`, le journal avec le statut `terminé`.
  Sinon, arrête-toi et renvoie vers la phase manquante.
- Lis les trois. Crée `4-verification.md` à partir de [verification-template.md](verification-template.md), statut
  `brouillon`, et remplis-le au fil des étapes. S'il existe déjà (vérification précédente `bloqué`), repasse-le en
  `brouillon` et refais toutes les étapes : les preuves précédentes ne sont plus fraîches.

## 2. Preuves automatiques

Lance, dans cette phase, et lis la sortie complète (code de sortie, nombre d'erreurs) :

- `npm run lint` → 0 erreur ;
- `npm run build` → exit 0 (c'est la vérification TypeScript de référence) ;
- `npm test`, si le script existe → 0 échec.

Note la commande et le résultat dans le rapport. Un échec s'écrit comme un échec, avec la sortie utile.

## 3. Critères d'acceptation

Reprends **un par un** les critères d'acceptation du brief, puis ses règles métier et ses états. Pour chacun : la
preuve (test, commande, parcours dans le navigateur, ligne de code) ou « non vérifié, raison ». Un critère sans preuve
n'est pas validé.

## 4. Revue de code indépendante

Lance un sous-agent `general-purpose` avec un contexte neuf : l'auteur du code a les mêmes angles morts que le code.
Donne-lui :

- le prompt de [reviewer-prompt.md](reviewer-prompt.md) ;
- la plage à relire : `git diff origin/dev...HEAD` (après `git fetch origin`) ;
- les chemins du brief, du plan et du journal (ses **Décisions** et **Raccourcis**) ;
- la section **Points de vigilance** du plan, à vérifier un par un.

Ne crois pas son verdict sur parole : relis chaque constat dans le code avant de l'accepter. Puis trie :

- **À corriger** (bug, faille, perte de données, convention violée) : corrige-les en une passe, chaque correction
  prouvée par la commande qui le montre, puis relance les preuves de l'étape 2. Commite chaque correction
  (`fix(<scope>): …`) et note son commit dans le rapport. Une correction qui dépasse quelques lignes ou touche
  plusieurs fichiers ne se fait pas ici : rouvre l'implémentation (section 8).
- **À améliorer** et **Optionnel** : ne les corrige pas toi-même. Liste-les dans le rapport, l'utilisateur décide.

## 5. Parcours dans le navigateur

Lance `make dev` en arrière-plan (port 5173 imposé par l'OIDC), puis ouvre l'app :

- dans **Orca**, avec le navigateur intégré (skill `orca-cli`) ;
- sinon avec **Claude in Chrome** (outils `mcp__claude-in-chrome__*` ; charge sa skill si elle est listée, par exemple
  `anthropic-skills:chrome-browser`).

Si `make dev` échoue parce que le port 5173 est pris (serveur d'un autre worktree), ne change pas de port : l'OIDC
refuse toute autre origine. Demande à l'utilisateur d'arrêter l'autre serveur, sinon note le parcours comme non vérifié.
Sans aucun navigateur pilotable, même chose : le parcours passe dans la checklist de l'utilisateur.

**Connexion** : les écrans publics se vérifient sans compte. Pour un écran qui demande d'être connecté, utilise la
session déjà ouverte dans le navigateur s'il y en a une (Claude in Chrome reprend celle de l'utilisateur). Sinon,
demande à l'utilisateur de se connecter dans le navigateur ouvert. **Ne saisis jamais toi-même d'identifiants.** S'il
ne le peut pas, note ces écrans « non vérifié : connexion requise » et ajoute-les à sa checklist.

Vérifie, sur chaque écran touché par la feature :

- **thème clair et sombre** : contrastes, aucune couleur en dur qui jure ;
- **largeur mobile** (sous le breakpoint `md`, 768 px) : pas de débordement ni de contenu coupé ;
- **états chargement, vide et erreur**, quand tu peux les provoquer ;
- **navigation** : breadcrumb, menu actif, bouton retour, rechargement sur l'URL.

Les tests unitaires et d'intégration ne voient pas le rendu réel : ce parcours les complète, il ne les remplace pas.

**Les rôles restent à l'utilisateur** : ils demandent des comptes OIDC distincts. Prépare-lui une checklist ciblée :
pour chaque rôle concerné par le brief, ce qu'il doit voir et pouvoir faire, et ce qui doit lui être refusé. Même chose
pour tout ce que tu n'as pas pu vérifier toi-même.

## 6. Dette technique

1. Liste les raccourcis de la branche : `git diff origin/dev...HEAD | grep -nE "^\+.*// ?shortcut:"`, en plus de
   la section **Raccourcis** du journal.
2. Ajoute chacun à `docs/tech-debt.md`, dans la bonne priorité (P1 bug ou risque, P2 écart qui se propage, P3
   nettoyage), au format du tableau existant. Un raccourci sans « quand y revenir » est signalé à l'utilisateur.
3. Ajoute aussi les constats de revue que l'utilisateur choisit de ne pas traiter.
4. Retire de `docs/tech-debt.md` les points que la feature a corrigés.

## 7. Documentation

Les mises à jour de doc ont normalement été faites avec les tâches du plan. Ici, tu **contrôles** l'étape « Documenter »
de `docs/process/new-feature.md` contre le diff : conventions, architecture, variables d'environnement, glossaire,
sommaires des dossiers de `docs/`. Complète ce qui manque et note-le dans le rapport.

## 8. Conclure

1. Complète le rapport : verdict, ce qui reste à l'utilisateur (checklist des rôles, points non vérifiés, constats non
   traités).
2. Rends la main à la skill `feature` (si tu as été appelé seul, demande la validation puis applique toi-même son
   étape « À la validation », section 3). Quand l'utilisateur a fait sa checklist et valide, la feature est prête pour
   la PR (`docs/process/pull-request.md`) : le brief et ce rapport fournissent le résumé et le plan de test de la
   description. La revue de l'étape 4 tient lieu de `/code-review`, sauf si du code a changé après la vérification.
3. **Si quelque chose bloque** (critère d'acceptation en échec, retour négatif de la checklist des rôles, correction
   trop large pour l'étape 4) et que l'utilisateur confirme qu'il faut corriger :
    - ajoute à la fin de `2-plan.md` une section **Corrections après vérification**, avec une tâche par problème
      (numérotée à la suite, au format des autres tâches) ;
    - repasse `3-execution.md` en `en cours` ;
    - passe ce rapport en `bloqué`, verdict `Bloqué : <raison>`, en listant les problèmes et les tâches créées ;
    - rends la main à la skill `feature`, qui commite et renvoie vers la phase Implémenter. La vérification suivante
      reprend ce rapport et le met à jour.

    Si le problème vient du brief lui-même (règle manquante ou fausse), ne crée pas de tâche : l'utilisateur décide
    s'il faut recadrer.

---

_Adapté de `verification-before-completion` de [obra/superpowers](https://github.com/obra/superpowers) et de
`ponytail-review` / `ponytail-debt` de [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT).
Voir `.claude/skills/THIRD_PARTY_NOTICES.md`._
