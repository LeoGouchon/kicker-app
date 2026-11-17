---
name: planifier
description: Phase 2 du workflow feature de kicker-app. Transforme un brief validé (specs/<feature>/1-brief.md) en plan d'implémentation découpé en tâches vérifiables, écrit dans specs/<feature>/2-plan.md. À utiliser quand un brief est validé et qu'il faut planifier avant de coder, ou quand l'utilisateur tape /planifier.
---

# Planifier : du brief aux tâches

Tu écris le plan pour un développeur qui connaît React et TypeScript mais n'a vu ni ce code ni ce brief. Il fera un
choix raisonnable partout où le plan le laisse libre. Ce qu'il ne peut pas deviner, c'est **ce qui a été décidé** :
quels fichiers, quels noms et signatures, quelles valeurs du brief, comment prouver que chaque tâche marche. C'est ça
que le plan contient.

## 1. Prérequis

- `specs/<feature>/1-brief.md` existe avec le statut `validé`. Sinon, arrête-toi et renvoie vers la skill `cadrer`.
- Lis le brief en entier. **Le brief fait autorité** : le plan argumente à partir de lui et ne le contredit jamais. Si
  tu découvres un trou dans le brief, pose la question à l'utilisateur et complète le brief avant de continuer. Le
  brief reste `validé` : ajoute la réponse à sa section **Décisions** avec la mention « ajouté à la planification ».
  Il sera commité avec le plan. Si la réponse change le besoin lui-même, arrête-toi : il faut recadrer.
- Lis les conventions qui s'appliquent (`docs/conventions/README.md`, puis les fichiers utiles) et, selon la feature,
  `docs/process/add-a-page.md` et `docs/process/add-an-endpoint.md`.

## 2. La carte des fichiers

Avant de découper en tâches, liste les fichiers créés ou modifiés et la responsabilité de chacun. C'est ici que se
fixent les choix de découpage :

- respecte la structure de `docs/conventions/project-structure.md` (page dans `src/pages/<kebab>/`, satellites
  `.style.tsx` / `.utils.tsx` / `.reducer.tsx`, partagé dans `src/components/` ou `src/hooks/`) ;
- **réutilise avant de créer** : cherche dans `src/components/`, `src/hooks/`, `src/utils/` et `src/types/` ce qui fait
  déjà le travail, et nomme-le dans le plan ;
- un fichier = une responsabilité ; les fichiers qui changent ensemble vivent ensemble.

## 3. Le découpage en tâches

Suis l'ordre de `docs/process/new-feature.md` : types → hooks API → page → sous-composants → permissions → états UI.

- **Une tâche** = la plus petite unité qui se vérifie seule et qu'un relecteur pourrait refuser sans refuser sa voisine.
  Elle se termine par un résultat vérifiable.
- Range la configuration, l'échafaudage et la doc (glossaire, variable d'environnement, convention, sommaire) dans la
  tâche qui en a besoin, pas dans une tâche à part. La phase de vérification contrôle ensuite que rien ne manque.
- Chaque tâche finit par un commit au format Conventional Commits.
- **Plus de ~400 lignes de diff prévues** (hors `specs/`), ou plusieurs écrans indépendants : propose de découper la
  feature (voir `pull-request.md`). Le nombre de tâches seul ne justifie pas un découpage : il choisit le mode
  d'exécution (section 7).

## 4. Ce que contient une étape

Une étape est finie quand l'implémenteur peut en tirer **une seule** chose raisonnable. Non ambiguë, pas exhaustive :

- **Étape de code** : le fichier, la signature exacte (nom, props ou paramètres, type de retour) et les valeurs que le
  brief impose. L'implémenteur écrit le corps. Un corps n'apparaît que pour un algorithme que la signature ne détermine
  pas, ou un texte d'interface imposé.
- **Étape de vérification** : la commande à lancer et le résultat attendu (`npm run build` → exit 0). Quand le projet a
  des tests : le nom du test et ses assertions, avec les valeurs du brief.
- **Référence à une autre tâche** : renvoie à son bloc **Interfaces**, ne recopie pas son code.

Un plan plus long que le code qu'il décrit a écrit le code à la place de l'implémenteur. À l'inverse, une ligne qui ne
décide rien (« gérer les cas limites », « ajouter la validation adéquate », « TBD ») est un trou.

## 5. Écrire le plan

Écris `specs/<feature>/2-plan.md` à partir de [plan-template.md](plan-template.md), statut `brouillon`.

La section **Points de vigilance** liste les cinq situations que le brief implique mais qu'aucune tâche ne vérifie
encore, les plus probables d'abord : entrée, état ou rôle, et comportement qu'un utilisateur raisonnable attend. Pour
chacune, ajoute ensuite la vérification à la tâche concernée.

## 6. Auto-relecture

Relis le plan contre le brief, toi-même (pas de sous-agent) :

1. **Couverture** : chaque scénario, règle, état et critère d'acceptation du brief a une tâche. Sinon, ajoute-la.
2. **Étapes** : chaque étape décide quelque chose, et aucune ne contient un corps que la signature détermine déjà.
3. **Cohérence** : les noms et types d'une tâche correspondent à ceux qu'utilisent les tâches suivantes.
4. **Conventions** : aucune étape n'implique `style={{}}`, couleur en dur, `export default`, `enum`, `React.*` ou une
   page qui importe une autre page.
5. **Proportion** : si les blocs de code font l'essentiel du document, remplace-les par des signatures.

Corrige directement ce que tu trouves.

## 7. Conclure

1. Indique le mode d'exécution recommandé : **dans la conversation** par défaut ; **un sous-agent par tâche** si le plan
   dépasse 8 tâches. Note-le dans l'en-tête du plan.
2. Rends la main à la skill `feature`. Si tu as été appelé seul, demande la validation du plan, puis applique toi-même
   l'étape « À la validation » de la skill `feature` (section 3) : statut, commit, fin de session.

---

_Adapté de `writing-plans` de [obra/superpowers](https://github.com/obra/superpowers) (MIT). Voir
`.claude/skills/THIRD_PARTY_NOTICES.md`._
