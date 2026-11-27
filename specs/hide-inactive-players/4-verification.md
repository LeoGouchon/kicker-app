# Rapport de vérification : retirer les joueurs inactifs du classement général

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md) · **Plan** : [2-plan.md](2-plan.md) · **Journal** : [3-execution.md](3-execution.md)
- **Commits vérifiés** : `origin/dev...166902e`

## Verdict

Prêt après la checklist ci-dessous. Aucun critère en échec, aucun constat de revue à corriger. Seconde passe
(2026-11-26) contre le backend local de `hubscore/hide-inactive-players` (`8089d4d`, règle d'activité incluse) : les
cas « Inactif » et « joueur qui revient » ont été vus avec de vraies réponses de l'API, sans patch dans le navigateur.
Front validé par l'utilisateur le 2026-11-26, en local avec 4 joueurs inactifs (Lewis Hamilton, Cyril Gane, Valérie
Damidot, Paul Lefevre).

## Preuves automatiques

Relancées le 2026-11-26 sur `166902e`, après la correction de `DeltaIndicator`.

| Commande        | Résultat                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `npm run lint`  | exit 0 : 0 erreur, 19 avertissements, tous hors des fichiers de la feature (`eslint` sur eux : 0) |
| `npm run build` | exit 0 (`tsc -b` + `vite build`, seul l'avertissement existant de taille de chunk)                |
| `npm test`      | exit 0 : 10 fichiers, 87 tests passés, 2 ignorés (existants), 0 échec                             |

## Critères d'acceptation

| Critère du brief                                                                              | Preuve                                                                                                                                                               | Statut |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Sous-titre des classés « Joueurs classés (min. 10 matchs + 1 match récemment) »               | `SeasonStats.test.tsx` (year 0) ; navigateur sur `/ranking`                                                                                                          | ok     |
| Sous-titre des non classés « Joueurs non classés (moins de 10 matchs ou aucun match récent) » | `SeasonStats.test.tsx` ; navigateur                                                                                                                                  | ok     |
| Tag « Nouveau » (sans ELO) / « Inactif » (avec ELO) à la place de la numérotation             | `getUnrankedTag` testé ; `SeasonStats.test.tsx` ; navigateur : 7 « Nouveau » + 1 « Inactif » (ELO injecté)                                                           | ok     |
| ELO en clair pour un non classé qui en a un, placeholder flouté sinon                         | `SeasonStats.test.tsx` (1620) ; navigateur : « Inactif » affiche 1480, les autres restent floutés                                                                    | ok     |
| Classé sans rang de lundi : « New » si ELO de lundi absent, « – » sinon                       | `getRankEvolution` testé (5 cas) ; navigateur : Lewis Hamilton « New », Adrien Rabiot « – »                                                                          | ok     |
| « Diff 7j » et carte du dashboard : « – » si ELO de lundi absent, écart réel sinon            | `getEloDelta` et `DeltaIndicator` testés ; navigateur : « – » pour Lewis et Zidane, ↑ 16 pour Adrien, sur la page et la carte « General »                            | ok     |
| Saisons : plus de numérotation chez les non classés, reste inchangé                           | `SeasonStats.test.tsx` (2026 T3) ; navigateur sur Saison 4 : anciens libellés, ni tag ni numéro, ELO injecté resté flouté                                            | ok     |
| Avant le déploiement du backend, tous les non classés affichent « Nouveau »                   | navigateur contre le backend local actuel : 8 « Nouveau » ; revue : `currentElo` vaut `NULL` sous 10 matchs dans `hubscore` actuel                                   | ok     |
| Logique pure couverte par des tests colocalisés                                               | `eloDelta.test.ts`, `SeasonStats.utils.test.tsx`, `DeltaIndicator.test.tsx` (24 nouveaux tests ; le journal montre les tests `SeasonStats` rouges sur l'ancien code) | ok     |
| Spec backend commitée sur `feat/hide-inactive-players` de `hubscore`                          | `git log` du worktree `hubscore/hide-inactive-players` : `c444926 docs(specs): add spec for hide-inactive-players in global ranking`                                 | ok     |

Règles et états complémentaires :

- **Tri « Elo » et « Diff 7j » avec `null`** : `compareNullableNumbers` testé ; navigateur : tri croissant sur
  « Diff 7j » met les « – » en tête puis -59 → +46, aucun `NaN`.
- **Aucun joueur classé** : `SeasonStats.test.tsx` (tous à `rank: 0`) ; tableau des classés vide (« No data », libellé
  antd existant).
- **Chargement, vide, erreur** : inchangés (aucun code touché sur ces états).

## Revue de code

Sous-agent indépendant sur `git diff origin/dev...ff978f1`. Verdict : prêt. Les 5 points de vigilance du plan sont
respectés ; seuls `SeasonStats.tsx` et `RankingSummaryCard.tsx` consomment `GlobalStats`, tous deux adaptés. Pas de
nouvelle revue complète à la seconde passe : seul `DeltaIndicator` a changé depuis (`166902e`, ci-dessous).

- **Corrigés** (constats « À améliorer », traités à ta demande, commit `166902e`
  `refactor(ranking): color DeltaIndicator with antd text types`) :
    1. **Sens de la flèche non testé** : `DeltaIndicator.test.tsx` vérifie maintenant, pour chaque cas, l'icône
       (`caret-up` / `caret-down` / aucune) et la classe de couleur (`ant-typography-success` / `-danger` /
       `-secondary`). Rouge sur l'ancien code (2 échecs, aucune classe `success`/`danger`) ; vert sur le nouveau ; en
       inversant `faCaretUp` et `faCaretDown`, 2 échecs.
    2. **`DeltaIndicatorText` refaisait ce qu'antd fait déjà** : remplacé par `Typography.Text type="success"` /
       `type="danger"`. `DeltaIndicator.style.tsx`, la prop `trend` et le sélecteur `&&` sont supprimés. La couleur
       passe de `colorSuccess` / `colorError` à `colorSuccessText` / `colorErrorText`, les tokens d'antd pour du
       texte. Navigateur : carte « Classement » du dashboard lisible en thème clair et sombre (rouge
       `rgb(220, 68, 70)`, vert `rgb(73, 170, 25)` en sombre).
- **Non traités** : aucun.

## Vérification en conditions réelles

`make dev` (port 5173) contre le backend local sur 8080, navigateur intégré d'Orca, sans connexion (écrans publics).
Le backend local n'a pas encore la règle d'activité : les cas « Inactif », « New », « – » et retour d'inactivité ont
été provoqués en modifiant les réponses `/kicker/stats/*` dans la page (patch de `XMLHttpRequest`, aucun changement
dans le dépôt, retiré par un rechargement).

| Vérification                      | Résultat                                                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| « Tous les matchs »               | ok : libellés, tags, ELO de l'inactif, « New » / « – » / flèches, « Diff 7j » réel ou « – », tri sans `NaN`                                                                                                            |
| Saison en cours                   | ok : anciens libellés, ni tag ni numérotation, ELO d'un non classé masqué même s'il est envoyé                                                                                                                         |
| Carte « Classement » du dashboard | ok : « General » affiche « – » ou l'écart réel (↑ 16), section « Saison » inchangée                                                                                                                                    |
| Thème clair et sombre             | ok : contrastes corrects, couleurs des écarts lisibles dans les deux thèmes                                                                                                                                            |
| Largeur mobile (390 px)           | ok pour la feature (tableaux en défilement horizontal, comme avant). Préexistant : « New » et « = 0 » passent à la ligne lettre par lettre dans la colonne d'évolution (`width: 60` déjà sur `dev`), ajouté à la dette |
| États chargement, vide, erreur    | non provoqués : code inchangé ; « aucun classé » couvert par test                                                                                                                                                      |
| Navigation                        | ok : breadcrumb « Accueil / Classement », menu actif, chargement direct de `/ranking`                                                                                                                                  |

### Seconde passe : backend local avec la règle d'activité

Conteneurs `hubscore-hide-inactive-players` (backend `8089d4d` sur 8080, `postgres:17`), `make dev` sur 5173,
navigateur intégré d'Orca, sans connexion. À l'état initial, les 19 joueurs à 10 matchs ou plus sont actifs (seed). Comme
dans la vérification de `hubscore`, les dates des 252 matchs de Lewis Hamilton ont été sauvegardées dans une table
temporaire puis modifiées, avec `REFRESH MATERIALIZED VIEW mv_player_match_facts` à chaque étape.

| Cas (réponse de `/kicker/stats/global`)                                                               | Affichage                                                                                                                              |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Matchs de Lewis reculés de 200 jours : `rank 0`, `currentElo 2146` ; autres rangs 1 à 18 (13, 13, 15) | ok : Lewis en tête des non classés avec « Inactif » et 2146 en clair ; 8 « Nouveau » à ELO flouté ; classés numérotés 1 à 18 sans trou |
| Dernier match remis au 24/11 : `rank 1`, `rankLastWeek null`, `currentElo 2146`, `eloLastWeek 2162`   | ok : `/ranking` affiche Lewis n° 1, évolution « – », Diff 7j ▼ 16 ; carte « General » du dashboard : #1 Lewis H., 2146, ▼ 16           |
| Remise en état : dates restaurées, table temporaire supprimée, vue rafraîchie                         | réponse de `/global` identique octet pour octet à l'état initial (`cmp`)                                                               |

Données de test : aucune laissée en base locale.

## À faire par l'utilisateur

- [ ] **Tous les rôles** (anonyme, user, modérateur, admin) : la feature ne change aucun droit, les écrans sont
      publics. Rien de spécifique à vérifier par rôle.
- [ ] **Après le déploiement de la règle d'activité dans `hubscore`** (vérifié en local, voir « Seconde passe ») : sur
      l'environnement déployé, contrôle rapide de `/ranking` › « Tous les matchs » avec les vraies données (inactifs
      réels, rangs sans trou).

## Dette et documentation

- **Ajouté à `docs/tech-debt.md`** (P1, préexistants, repérés pendant la vérification) : colonne d'évolution du rang
  trop étroite sur mobile ; tableau des classés sans `rowKey`.
- **Retiré de `docs/tech-debt.md`** (pendant l'implémentation) : couleurs en dur de `Dashboard.style.tsx`, un
  `!important` (12 → 11), duplication du rendu du delta de rang, `SeasonStats.style.tsx` vide.
- **Raccourcis** : aucun (`shortcut:` absent du diff, section vide du journal).
- **Doc mise à jour** : contrôle de l'étape « Documenter » de `docs/process/new-feature.md` : glossaire (Classement,
  Classement général, Joueur actif, Non classé), `project-structure.md` (« Trois `.style.tsx` vides »), dette. Aucune
  convention, architecture ni variable d'environnement nouvelle. Fichiers touchés sous 200 lignes.
