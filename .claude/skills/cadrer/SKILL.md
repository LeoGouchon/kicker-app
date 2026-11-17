---
name: cadrer
description: Phase 1 du workflow feature de kicker-app. Interroge l'utilisateur par tours de questions jusqu'à ce que le besoin soit entièrement tranché, tient à jour le glossaire métier et les ADR, puis écrit specs/<feature>/1-brief.md. À utiliser pour cadrer une feature ou un correctif avant tout plan ou code, ou quand l'utilisateur tape /cadrer.
argument-hint: '[description de la feature]'
---

# Cadrer : construire le besoin avec l'utilisateur

Tu interroges l'utilisateur jusqu'à une compréhension partagée **complète** du besoin, puis tu l'écris dans
`specs/<feature>/1-brief.md`. Tu n'écris ni plan ni code dans cette phase.

Le dossier `specs/<feature>/` est déterminé par la skill `feature` (partie kebab du nom de branche).

## 1. Préparer

1. Lis `docs/glossary.md` : c'est le vocabulaire de référence pour tout l'échange.
2. Repère dans `docs/README.md` les dossiers utiles (architecture, conventions) et lis seulement ce qui concerne la
   demande.
3. Lis `docs/tech-debt.md` : une dette sur la zone touchée peut changer le périmètre.

## 2. L'arbre de décisions

Représente le besoin comme un **arbre de décisions** : chaque décision ouvre celles qui en dépendent. Il couvre au
minimum ces branches (issues de `docs/process/new-feature.md`) :

- **Besoin** : quel problème, pour qui, et comment on sait qu'il est résolu.
- **Écran et parcours** : nouvelle page (URL, menu, breadcrumb) ou page existante ; étapes du parcours.
- **Rôles** : anonyme, user, modérateur, admin. Qui voit, qui agit.
- **Données et API** : endpoints nécessaires, existants ou non côté backend, contrat, droits.
- **États** : chargement, vide, erreur ; confirmation et retour après chaque action.
- **Règles métier et cas limites** : valeurs extrêmes, listes vides, données manquantes, droits refusés.
- **Existant réutilisable** : composants, hooks, utilitaires, types déjà là.
- **Hors périmètre** : ce qu'on ne fait pas, dit explicitement.
- **Décision structurante** : nouvelle librairie, nouveau pattern → ADR.
- **Tests** : si le projet a des tests, ce qui doit être testé et à quel niveau.

## 3. Les tours de questions

La **frontière** est l'ensemble des décisions dont les prérequis sont déjà tranchés : les questions qu'on peut poser
_maintenant_ sans présumer d'une réponse pas encore donnée. À chaque tour, pose **toute la frontière**, puis attends les
réponses.

Format d'un tour :

```
❓ **Q1 - <titre court>** : <la question, avec les options s'il y en a>

➡️ <ta recommandation>

---

❓ **Q2 - <titre court>** : …
```

- Formule chaque question pour que « oui » accepte ta recommandation.
- Une question qui dépend d'une autre question encore ouverte attend le tour suivant.
- Après chaque tour, recalcule la frontière à partir des réponses et pose le tour suivant.
- L'utilisateur peut répondre en bloc (« 1 oui, 2 non parce que… ») : accepte ce format.

**Les faits sont ton travail, les décisions sont les siennes.** Ne demande jamais à l'utilisateur ce que tu peux
trouver dans le code, la doc ou l'API : lance un sous-agent (type `Explore`) pour le chercher. Ne bloque pas dessus :
seules les questions qui dépendent de ce fait attendent son retour, pose les autres.

## 4. Le vocabulaire métier

Pendant tout l'échange, tiens le glossaire `docs/glossary.md` :

- **Conflit** : si l'utilisateur emploie un terme dans un autre sens que le glossaire, dis-le tout de suite (« Le
  glossaire définit _Saison_ comme un trimestre ; tu parles d'une année ? »).
- **Flou** : un terme vague ou à double sens → propose un terme précis.
- **Scénarios** : invente des cas concrets qui testent les frontières entre deux notions (un match en 1 contre 2 ?
  un joueur sans compte ?).
- **Code** : quand l'utilisateur décrit un fonctionnement, vérifie que le code dit la même chose. Signale tout écart.
- **Mise à jour** : quand un terme est tranché, ajoute-le ou corrige-le dans `docs/glossary.md` aussitôt, au format du
  fichier. Le glossaire ne contient que du vocabulaire métier, jamais de détail d'implémentation.

## 5. Les ADR, avec parcimonie

Propose un ADR seulement si les trois conditions sont réunies :

1. **difficile à défaire** : changer d'avis plus tard coûte cher ;
2. **surprenant sans contexte** : un futur lecteur se demandera « pourquoi ont-ils fait ça ? » ;
3. **issu d'un vrai compromis** : il y avait d'autres options sérieuses.

Si l'utilisateur accepte, rédige-le dans `docs/decisions/` en suivant `docs/decisions/README.md` (gabarit, numéro
suivant, statut `Proposé`, ligne au sommaire).

## 6. Conclure

Le cadrage est fini quand la frontière est vide : chaque branche de l'arbre est visitée, rien n'est présumé en silence.

1. Annonce que tu n'as plus de question et résume les décisions en quelques lignes.
2. Attends que l'utilisateur confirme qu'il n'a rien à ajouter.
3. Écris `specs/<feature>/1-brief.md` à partir de [brief-template.md](brief-template.md), statut `brouillon`.
4. Rends la main à la skill `feature` (ou, si tu as été appelé seul, demande la validation du brief).

Le brief décrit le besoin et les décisions, **pas l'implémentation** : pas de chemin de fichier ni de code, sauf si une
décision ne s'exprime pas autrement (forme d'un type imposé par l'API par exemple).

---

_Adapté de `grilling` et `domain-modeling` de [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). Voir
`.claude/skills/THIRD_PARTY_NOTICES.md`._
