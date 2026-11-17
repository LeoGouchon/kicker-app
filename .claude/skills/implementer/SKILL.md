---
name: implementer
description: Phase 3 du workflow feature de kicker-app. Exécute un plan validé (specs/<feature>/2-plan.md) tâche par tâche avec le changement minimal qui respecte les conventions, prouve chaque tâche, et tient le journal specs/<feature>/3-execution.md. À utiliser quand un plan est validé et qu'il faut coder, ou quand l'utilisateur tape /implementer.
---

# Implémenter : exécuter le plan

Le plan a déjà fait la réflexion. Tu l'exécutes, tu prouves chaque tâche, et tu laisses dans `3-execution.md` une
trace qui survit à la compaction du contexte et au changement de machine.

## 1. Prérequis et reprise

- `1-brief.md` et `2-plan.md` existent dans `specs/<feature>/`, le plan avec le statut `validé`. Sinon, arrête-toi et
  renvoie vers la phase manquante.
- Lis le brief puis le plan. **Le brief fait autorité**, le plan argumente à partir de lui.
- Si `3-execution.md` existe, c'est le journal : les tâches marquées `faite` **sont faites**, leurs commits existent.
  Fais confiance au journal et à `git log` plutôt qu'à ta mémoire, et reprends à la première tâche non faite. Après un
  rebase, les SHA du journal ne correspondent plus : retrouve les commits par leur message.
- Journal rouvert après une vérification bloquée : les tâches de correction sont à la fin du plan, reprends à la
  première d'entre elles.
- Sinon, crée-le à partir de [execution-template.md](execution-template.md), statut `en cours`.
- Crée une tâche de suivi (TodoWrite) par tâche du plan.

## 2. Mode d'exécution

Lis la ligne **Exécution** du plan :

- **Dans la conversation** (défaut) : tu fais chaque tâche toi-même.
- **Un sous-agent par tâche** : pour chaque tâche, lance un sous-agent `general-purpose` avec le texte de la tâche, les
  chemins du brief et du plan, la section 3 ci-dessous et le rappel des règles de `CLAUDE.md`. Quand il rend la main,
  **ne crois pas son rapport** : lis le diff, relance toi-même la vérification de la tâche, puis remplis le journal.

## 3. Écrire le code : le changement le plus petit qui règle tout

Avant d'écrire, lis le code que la tâche touche et liste tout ce que le changement doit atteindre : appelants, types,
routes, menu, invalidations de cache. C'est ça le périmètre, pas les extras.

Prends la première option qui marche entièrement :

1. **Faut-il vraiment le faire ?** Pas d'option, de prop ni de flexibilité que personne n'a demandée.
2. **Ça existe déjà dans le projet ?** Un composant, un hook, un utilitaire : utilise-le comme le code voisin.
3. **antd, React ou le navigateur le font ?** Utilise-les. Un composant maison existant passe avant un composant antd.
4. **Une dépendance déjà installée le fait ?** Utilise-la. N'ajoute jamais une dépendance pour quelques lignes.
5. Sinon : le minimum de code qui marche, lisible du premier coup.

Règles :

- **Paresseux sur la solution, jamais sur le changement** : finis tout ce que la tâche exige, y compris les appelants
  et les types que ton changement casse.
- **Les conventions du projet ne sont pas négociables**, même quand elles coûtent des lignes : fichier
  `.style.tsx` plutôt que `style={{}}`, tokens antd, exports nommés, états chargement / vide / erreur, feedback via
  `App.useApp()`. Le plus court ne gagne jamais contre `CLAUDE.md`.
- Pas d'abstraction, de wrapper ni de code « pour plus tard ».
- Un commentaire dit seulement le _pourquoi_ que le code ne montre pas, en une ligne, en anglais.
- **Raccourci assumé** : s'il a une limite connue, marque-le dans le code par
  `// shortcut: <the limit>, <when to upgrade>` et note-le dans le journal. La phase de vérification le reporte dans
  `docs/tech-debt.md`.
- **Jamais de coupe** sur : la vérification des droits côté interface, la gestion d'erreur qui évite une perte de
  données, l'accessibilité, ce que le brief demande.
- **Correctif** : cherche tous les appelants de la fonction touchée et corrige la cause une seule fois, dans le code
  partagé.

## 4. La boucle par tâche

1. Relis la tâche dans le plan (pas ton souvenir de la tâche : les valeurs exactes sont dans le plan).
2. Fais les étapes dans l'ordre. Chaque étape de vérification a un résultat attendu : lance la commande, **lis la
   sortie**, compare.
    - **Ça correspond** : étape suivante.
    - **Le code est faux** : trouve la cause, ne maquille jamais le symptôme pour que la sortie corresponde.
    - **Le plan est faux** (contredit le brief, interface incohérente, commande impossible) : choisis le plus petit
      changement qui respecte le brief, note-le dans le journal comme **décision**, et continue.
3. Avant de déclarer la tâche faite, tout ceci est vrai, preuve à l'appui dans cette session :
    - `npm run lint` et `npm run build` passent (et `npm test` s'il existe) : tu as lu la sortie ;
    - chaque résultat attendu du plan a été comparé à la sortie réelle ;
    - chaque écart au plan a sa ligne **Décision** dans le journal.
4. Commite comme le plan l'indique, et mets à jour le journal dans le même mouvement (ligne de la tâche + commits).
5. Donne un point d'étape d'une ou deux lignes (ce qui est fait, décision éventuelle), puis enchaîne la tâche
   suivante sans attendre de réponse.

## 5. Quand s'arrêter et demander

Tranche toi-même les ambiguïtés et note-les comme décisions. Seules ces situations t'arrêtent :

- une opération destructive ou irréversible ;
- une action sensible pour la sécurité ou les droits ;
- un effet hors de la branche (push, merge, PR, appel à une API réelle qui modifie des données) ;
- un plan si faux que toute suite serait une supposition ;
- un endpoint du brief qui n'existe pas ou ne répond pas comme prévu.

## 6. Conclure

1. Toutes les tâches sont faites : passe le journal en `à valider` (jamais `terminé` : seule la validation de
   l'utilisateur donne ce statut) et complète sa section **Bilan**. Commite le journal.
2. Rends la main à la skill `feature` (ou, si tu as été appelé seul, propose `/verifier`). La revue complète se fait
   dans la phase de vérification, pas ici.

---

_Adapté de `executing-plans` de [obra/superpowers](https://github.com/obra/superpowers) et de `ponytail` de
[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT). Voir
`.claude/skills/THIRD_PARTY_NOTICES.md`._
