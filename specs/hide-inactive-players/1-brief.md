# Brief : retirer les joueurs inactifs du classement général

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Branche** : `feat/hide-inactive-players`
- **Date** : 2026-11-24

## Besoin

Le classement général classe tous les joueurs qui ont au moins 10 matchs depuis le début, même ceux qui ne jouent plus
depuis des mois. Ces joueurs figés gardent leur place et faussent la lecture du classement, pour tous les visiteurs de
la page Classement et de la carte du dashboard. Le besoin est résolu quand le classement général ne classe que des
**joueurs actifs**, sans faire disparaître les autres.

## Solution retenue

- **Règle** : pour être classé au classement général, un joueur doit avoir au moins 10 matchs au total **et** être
  actif, c'est-à-dire avoir joué au moins un match dans les 90 derniers jours. Un joueur qui n'est pas actif passe dans
  les **non classés**, avec son ELO visible. Il retrouve un rang dès qu'il rejoue.
- **Côté backend** (projet `hubscore`) : le calcul du rang change. La spec complète est le contrat de référence :
  `hubscore`, branche `feat/hide-inactive-players`, fichier `specs/hide-inactive-players/spec.md`.
- **Côté front** :
    - page **Classement › « Tous les matchs »** : nouveaux libellés, tag « Nouveau » ou « Inactif » chez les non classés,
      ELO visible quand le backend l'envoie, affichage correct des évolutions sur 7 jours ;
    - pages des **saisons** : la colonne de numérotation des non classés disparaît ;
    - **carte « General » du dashboard** : elle suit le nouveau rang sans autre changement, sauf la correction de
      l'évolution sur 7 jours.

## Rôles et accès

La page Classement et le dashboard sont publics. La feature ne change aucun droit.

| Rôle       | Voit                                 | Peut faire                |
| ---------- | ------------------------------------ | ------------------------- |
| Anonyme    | Classement général et saisons, carte | Rien de nouveau (lecture) |
| User       | Idem                                 | Idem                      |
| Modérateur | Idem                                 | Idem                      |
| Admin      | Idem                                 | Idem                      |

## Scénarios

1. En tant que visiteur, je veux que le classement général ne classe que des joueurs actifs, afin de lire un
   classement qui reflète le niveau actuel.
2. En tant que joueur qui n'a pas joué depuis plus de 90 jours, je veux me retrouver dans les non classés avec un tag
   « Inactif » et mon ELO visible, afin de comprendre pourquoi j'ai perdu mon rang et ce que je vaux toujours.
3. En tant que joueur qui revient après une longue absence, je veux retrouver un rang dès mon premier match et voir
   mon gain ou ma perte de points depuis lundi, afin de suivre ma progression sans être présenté comme un nouveau.
4. En tant que nouveau joueur avec moins de 10 matchs, je veux un tag « Nouveau » dans les non classés, afin de savoir
   qu'il me faut encore des matchs.

## Données et API

- **`GET /kicker/stats/global`** : existant, **à modifier côté backend** selon la spec `hubscore`. La forme de la
  réponse ne change pas (aucun champ ajouté). Ce qui change :
    - `rank = 0` pour un joueur inactif. Les rangs sont calculés parmi les classés seulement, donc sans trou laissé par
      les inactifs ;
    - `currentElo` est renseigné dès 10 matchs au total, actif ou non, et vaut `null` en dessous (comme aujourd'hui) ;
    - `rankLastWeek` : rang à la coupure du lundi 00:00, avec la même règle d'activité évaluée à cette date. Vaut `null`
      si le joueur n'était pas classé ;
    - `eloLastWeek` : ELO à la coupure, pour tout joueur qui avait au moins 10 matchs, actif ou non. Sinon, `null`.
- **`GET /kicker/stats/season/{année}/{trimestre}`** : existant, inchangé.
- **Indépendance des déploiements** : le front fonctionne avant et après le déploiement du backend. Avant, tous les non
  classés ont moins de 10 matchs, donc pas d'ELO, et ils affichent « Nouveau », ce qui est exact.
- **Typage** : le backend envoie `null` (pas `0`) pour `rankLastWeek`, `eloLastWeek` et `currentElo` absents. Le type
  front doit le refléter.

## Règles métier et cas limites

- **Classé au classement général** : `rank > 0`, calculé par le backend. Le front ne recalcule aucun rang.
- **Tag des non classés** (« Tous les matchs » uniquement) : il remplace la colonne de numérotation.
    - « Nouveau » si le joueur n'a pas d'ELO (moins de 10 matchs au total) ;
    - « Inactif » s'il a un ELO.
    - Cas accepté : un joueur inactif avec moins de 10 matchs affiche « Nouveau ».
- **ELO des non classés** : affiché quand le backend l'envoie, sinon le placeholder flouté actuel.
- **Évolution du rang** (colonne des flèches, classés) :
    - rang de lundi connu : flèche ↑ / ↓ avec l'écart, ou « = 0 » ;
    - rang de lundi absent **et** ELO de lundi absent : « New » (vient d'atteindre 10 matchs) ;
    - rang de lundi absent **mais** ELO de lundi présent : un neutre « – » (retour d'inactivité, pas de « New »).
- **Diff 7j** (page Classement et carte du dashboard) :
    - ELO de lundi présent : écart `currentElo - eloLastWeek` (y compris pour un retour d'inactivité) ;
    - ELO de lundi absent : un neutre « – », au lieu d'afficher tout l'ELO comme un gain (bug actuel).
- **Pages des saisons** : la règle d'activité ne s'applique pas. Le tableau des non classés perd sa colonne de
  numérotation, rien ne la remplace. Libellés inchangés.
- **Classement vide** : si aucun joueur n'est classé, le tableau des classés est vide et les non classés restent
  affichés.

## États de l'interface

- **Chargement** : inchangé (squelette).
- **Vide** : inchangé (message « La saison sélectionnée n'existe pas… » quand la réponse est vide ; « Aucun joueur
  classé » sur la carte du dashboard).
- **Erreur** : inchangé. L'absence d'état d'erreur sur la page Classement est une dette existante, hors périmètre.
- **Après une action** : sans objet, la feature est en lecture seule.

## Critères d'acceptation

- [ ] « Tous les matchs » : le sous-titre des classés est « Joueurs classés (min. 10 matchs + 1 match récemment) ».
- [ ] « Tous les matchs » : le sous-titre des non classés est « Joueurs non classés (moins de 10 matchs ou aucun match
      récent) ».
- [ ] « Tous les matchs » : la colonne de numérotation des non classés est remplacée par un tag « Nouveau » (sans ELO)
      ou « Inactif » (avec ELO).
- [ ] « Tous les matchs » : un non classé avec un ELO l'affiche en clair ; sans ELO, le placeholder flouté reste.
- [ ] Un joueur classé dont le rang de lundi est absent affiche « New » si son ELO de lundi est absent, « – » sinon.
- [ ] La colonne « Diff 7j » et la carte du dashboard affichent « – » quand l'ELO de lundi est absent, et l'écart
      réel sinon.
- [ ] Pages des saisons : le tableau des non classés n'a plus de colonne de numérotation ; le reste est inchangé.
- [ ] Avant le déploiement du backend, la page fonctionne : tous les non classés affichent « Nouveau ».
- [ ] La logique pure (choix du tag, état de l'évolution du rang, écart d'ELO avec valeurs absentes) a des tests
      unitaires colocalisés.
- [ ] La spec backend existe sur la branche `feat/hide-inactive-players` de `hubscore`, commitée en local.

## Hors périmètre

- Une option pour réafficher les joueurs inactifs dans les classés.
- Les classements saisonniers : pas de règle d'activité.
- Le compteur de joueurs du bouton « Tous les matchs », qui compte toujours tous les joueurs de l'historique.
- Le calcul de l'ELO : les matchs des inactifs comptent toujours.
- La fiche joueur, qui n'affiche pas de rang général.
- Le libellé « Diff 7j », trompeur puisque la référence est le lundi 00:00 et non J-7.
- L'absence d'état d'erreur sur la page Classement et le libellé « General » en anglais (dette existante).
- Le développement backend lui-même : il suit la spec `hubscore`.

## Décisions

- **3 mois glissants (90 jours) plutôt que « saison en cours ou précédente »** : la fenêtre est la même pour tous,
  quel que soit le jour du trimestre.
- **L'interface reste vague sur la durée** (« récemment ») : la règle peut évoluer sans changer les textes.
- **Calcul côté backend** : le rang reste calculé à un seul endroit, avec une seule règle. Le front ne renumérote rien.
- **Pas de nouveau champ API** : l'ELO présent ou absent suffit à distinguer « Inactif » de « Nouveau ».
- **`eloLastWeek` découplé du rang** : un retour d'inactivité montre son gain de points depuis lundi au lieu d'un
  « New ».
- **Tag à la place de la numérotation** chez les non classés : le tableau ne s'élargit pas.
- Pas d'ADR : aucune décision difficile à défaire.

## Glossaire

- Ajoutés : **Classement général**, **Joueur actif**, **Non classé**.
- Modifié : **Classement** (classé parmi les classés ; classement saisonnier ou général).
