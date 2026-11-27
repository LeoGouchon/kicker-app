# Plan : retirer les joueurs inactifs du classement général

- **Statut** : validé (cycle des statuts : `specs/README.md`)
- **Brief** : [1-brief.md](1-brief.md)
- **Exécution** : dans la conversation (4 tâches)

**Objectif** : adapter la page Classement et la carte du dashboard au nouveau rang calculé par le backend : libellés,
tag « Nouveau » / « Inactif », ELO des inactifs, et valeurs de lundi absentes gérées sans faux « New » ni faux gain.

**Approche** : le front ne recalcule aucun rang, il lit `rank`, `currentElo`, `rankLastWeek` et `eloLastWeek`. Toute la
logique de décision sort en fonctions pures testées. L'affichage d'un écart (↑ / ↓ / « = 0 » / « – »), aujourd'hui
dupliqué entre `SeasonStats` et `RankingSummaryCard`, devient un composant partagé `DeltaIndicator`. Les modules
existants restent dans `src/modules/` (migration hors périmètre, voir `docs/tech-debt.md`).

## Contraintes globales

- « Tous les matchs » = `SeasonStats` avec `year === 0` (variable `isAllTime`). Tout changement de libellé, de tag ou
  d'ELO des non classés est conditionné à `isAllTime`. Les pages des saisons ne perdent que la colonne de numérotation.
- Textes imposés (« Tous les matchs ») :
    - classés : `Joueurs classés (min. 10 matchs + 1 match récemment)` ;
    - non classés : `Joueurs non classés (moins de 10 matchs ou aucun match récent)` ;
    - tags : `Nouveau` (pas d'ELO), `Inactif` (ELO présent).
- Textes inchangés sur les saisons : `Joueurs classés (min. 10 matchs)` et `Joueurs non classé (-10 matchs)`.
- Valeur neutre : le tiret demi-cadratin `–` (U+2013), en `type="secondary"`. Le libellé `New` reste tel quel.
- Une valeur absente est `null` (spec `hubscore`, déjà vérifiée sur sa branche `feat/hide-inactive-players`). On ne
  teste jamais `=== 0` pour `rankLastWeek` ou `eloLastWeek`.
- Couleurs des écarts : `var(--ant-color-success)` / `var(--ant-color-error)`, plus de `'green'` / `'red'` dans le code
  touché. Aucun `style={{}}` ajouté ; le style déplacé va dans le `.style.tsx`.
- `GET /kicker/stats/global` et les hooks de `useStats.ts` ne changent pas.

## Points de vigilance

1. Saison dont l'endpoint renverrait un `currentElo` pour un non classé → ni ELO en clair ni tag : le placeholder flouté
   reste (vérifié en tâche 4).
2. Joueur classé revenu d'inactivité (`rankLastWeek = null`, `eloLastWeek` présent) → « – » dans l'évolution du rang
   et l'écart réel dans « Diff 7j » (vérifié en tâches 2 et 3).
3. Tri des colonnes « Elo » et « Diff 7j » avec des valeurs `null` → pas de `NaN`, les `null` comptent comme la plus
   petite valeur (vérifié en tâche 2).
4. Aucun joueur classé sur « Tous les matchs » → tableau des classés vide, tous les non classés affichés avec leur tag
   (vérifié en tâche 4).
5. Section « Saison » de la carte du dashboard → elle passe aussi par `DeltaIndicator` et affiche « – » quand
   `eloLastWeek` est `null` (vérifié en tâche 3).

## Carte des fichiers

| Fichier                                                              | Action   | Responsabilité                                                                  |
| -------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `src/utils/eloDelta.ts` (+ `.test.ts`)                               | créer    | Écart d'ELO depuis lundi, `null` si une valeur manque (partagé : 2 pages)       |
| `src/components/delta-indicator/DeltaIndicator.tsx` (+ `.test.tsx`)  | créer    | Rendu d'un écart : ↑ n, ↓ n, « = 0 » ou « – »                                   |
| `src/components/delta-indicator/DeltaIndicator.style.tsx`            | créer    | `DeltaIndicatorText` coloré selon le sens                                       |
| `src/modules/mainStats/components/seasonStats/SeasonStats.utils.tsx` | créer    | Évolution du rang, tag des non classés, comparateur avec `null` (+ `.test.tsx`) |
| `src/modules/mainStats/components/seasonStats/SeasonStats.tsx`       | modifier | Libellés, colonnes, tags, ELO des non classés                                   |
| `src/modules/mainStats/components/seasonStats/SeasonStats.style.tsx` | modifier | (vide aujourd'hui) `SeasonStatsNewText`, `SeasonStatsBlurredEloText`            |
| `src/modules/mainStats/components/seasonStats/SeasonStats.test.tsx`  | créer    | Rendu des non classés selon les règles du brief                                 |
| `src/types/GlobalStats.type.ts`                                      | modifier | `currentElo`, `rankLastWeek`, `eloLastWeek` en `number \| null`                 |
| `src/modules/dashboard/components/RankingSummaryCard.tsx`            | modifier | `RankingDelta` remplacé par `DeltaIndicator`                                    |
| `src/modules/dashboard/Dashboard.style.tsx`                          | modifier | Suppression de `RankingDeltaText` (couleurs en dur + `!important`)              |
| `docs/tech-debt.md`, `docs/conventions/project-structure.md`         | modifier | Dette résorbée au passage                                                       |

---

### Tâche 1 : écart d'ELO et indicateur partagés

**Fichiers** :

- Créer : `src/utils/eloDelta.ts`, `src/utils/eloDelta.test.ts`
- Créer : `src/components/delta-indicator/DeltaIndicator.tsx`, `DeltaIndicator.style.tsx`, `DeltaIndicator.test.tsx`

**Interfaces** :

- Fournit : `getEloDelta(player: { currentElo: number | null; eloLastWeek: number | null }): number | null`.
- Fournit : `DeltaIndicator`, avec `type DeltaIndicatorProps = { delta: number | null }`.

- [ ] **Étape 1** : `getEloDelta` renvoie `currentElo - eloLastWeek`, ou `null` si l'une des deux vaut `null`.
- [ ] **Étape 2** : test `describe('getEloDelta')`, `it.each` : (1620, 1600) → 20 ; (1580, 1600) → -20 ;
      (1600, 1600) → 0 ; (1620, `null`) → `null` ; (`null`, 1600) → `null`.
- [ ] **Étape 3** : `DeltaIndicator` : `null` → `<Typography.Text type="secondary">–</Typography.Text>` ; `0` →
      `= 0` en secondaire ; positif → `DeltaIndicatorText` sens `up`, icône `faCaretUp` + valeur ; négatif → sens
      `down`, `faCaretDown` + valeur absolue. `DeltaIndicatorText = styled(Typography.Text, shouldForwardProp)` avec
      une prop `direction: 'up' | 'down'` → `var(--ant-color-success)` / `var(--ant-color-error)` (sélecteur `&&` si
      la couleur antd l'emporte, pas de `!important`).
- [ ] **Étape 4** : test `describe('DeltaIndicator')` avec `renderWithProviders`, `it.each` sur le texte affiché :
      `null` → `–` ; `0` → `= 0` ; `12` → `12` ; `-8` → `8`.
- [ ] **Étape 5** : `npm test`, `npm run lint`, `npm run build` → exit 0.
- [ ] **Étape 6** : commit `feat(ranking): add shared elo delta helper and indicator`.

### Tâche 2 : logique du tableau de classement

**Fichiers** :

- Créer : `src/modules/mainStats/components/seasonStats/SeasonStats.utils.tsx`, `SeasonStats.utils.test.tsx`

**Interfaces** :

- Fournit (paramètres typés explicitement, pas par `Pick<GlobalStats>` : le type ne devient nullable qu'en tâche 3, et
  les tests passent déjà des `null`) :
    - `getRankEvolution(player: { rank: number; rankLastWeek: number | null; eloLastWeek: number | null }): number | 'new' | null` ;
    - `getUnrankedTag(player: { currentElo: number | null }): 'new' | 'inactive'` ;
    - `compareNullableNumbers(a: number | null, b: number | null): number`.

- [ ] **Étape 1** : `getRankEvolution` : `rankLastWeek` non `null` → `rankLastWeek - rank` (positif = progression) ;
      `rankLastWeek` et `eloLastWeek` `null` → `'new'` ; `rankLastWeek` `null` seul → `null` (retour d'inactivité).
- [ ] **Étape 2** : `getUnrankedTag` : `currentElo === null` → `'new'`, sinon `'inactive'`.
- [ ] **Étape 3** : `compareNullableNumbers` : deux `null` → 0 ; `a` seul `null` → négatif ; `b` seul `null` →
      positif ; sinon `a - b`.
- [ ] **Étape 4** : tests, un `describe` par fonction :
    - `getRankEvolution` : rang 3 / lundi 5 → 2 ; 3 / 3 → 0 ; 3 / 1 → -2 ; rang 4, lundi `null`, ELO lundi `null` →
      `'new'` ; rang 4, lundi `null`, ELO lundi 1580 → `null` ;
    - `getUnrankedTag` : `null` → `'new'` ; 1620 → `'inactive'` ;
    - `compareNullableNumbers` : (1, 2) < 0 ; (2, 1) > 0 ; (`null`, 5) < 0 ; (5, `null`) > 0 ; (`null`, `null`) = 0.
- [ ] **Étape 5** : `npm test`, `npm run lint`, `npm run build` → exit 0.
- [ ] **Étape 6** : commit `feat(ranking): add ranking table helpers`.

### Tâche 3 : valeurs de lundi absentes (type, évolution du rang, Diff 7j)

**Fichiers** :

- Modifier : `src/types/GlobalStats.type.ts`, `SeasonStats.tsx`, `SeasonStats.style.tsx`, `RankingSummaryCard.tsx`,
  `Dashboard.style.tsx`
- Modifier : `docs/tech-debt.md`

**Interfaces** :

- Utilise : `getEloDelta`, `DeltaIndicator` (tâche 1) ; `getRankEvolution`, `compareNullableNumbers` (tâche 2).
- Fournit : `SeasonStatsNewText` dans `SeasonStats.style.tsx`.

- [ ] **Étape 1** : `GlobalStats` : `currentElo`, `rankLastWeek`, `eloLastWeek` passent en `number | null`.
- [ ] **Étape 2** : `SeasonStats`, tableau des classés :
    - colonne `rankLastWeek` : `getRankEvolution(record)` ; `'new'` → `<SeasonStatsNewText>New</SeasonStatsNewText>`
      (`var(--ant-color-info)`, remplace le `style` inline), sinon `<DeltaIndicator delta={…} />` ;
    - colonne « Diff 7j » : `<DeltaIndicator delta={getEloDelta(record)} />`, tri
      `compareNullableNumbers(getEloDelta(a), getEloDelta(b))` ;
    - colonne « Elo » : tri `compareNullableNumbers(a.currentElo, b.currentElo)`.
- [ ] **Étape 3** : `RankingSummaryCard` : supprimer `RankingDelta`, afficher
      `<DeltaIndicator delta={getEloDelta(rankingPlayer)} />`. Supprimer `RankingDeltaText` de `Dashboard.style.tsx`.
- [ ] **Étape 4** : `docs/tech-debt.md` : retirer `Dashboard.style.tsx` des couleurs en dur, passer `!important` de 12 à
      11, retirer « rendu du delta de rang » et `SeasonStats`, `RankingSummaryCard` de la ligne des duplications.
- [ ] **Étape 5** : `npm test`, `npm run lint`, `npm run build` → exit 0.
- [ ] **Étape 6** : contrôle dans `make dev` (dashboard et « Tous les matchs ») : les deux sections de la carte et la
      colonne « Diff 7j » affichent un écart ou « – », jamais tout l'ELO comme un gain.
- [ ] **Étape 7** : commit `fix(ranking): handle missing last-week rank and elo`.

### Tâche 4 : non classés de « Tous les matchs » et des saisons

**Fichiers** :

- Modifier : `SeasonStats.tsx`, `SeasonStats.style.tsx`
- Créer : `src/modules/mainStats/components/seasonStats/SeasonStats.test.tsx`
- Modifier : `docs/tech-debt.md`, `docs/conventions/project-structure.md`

**Interfaces** :

- Utilise : `getUnrankedTag` (tâche 2), `SeasonStatsNewText` (tâche 3).
- Fournit : `SeasonStatsBlurredEloText` dans `SeasonStats.style.tsx`.

- [ ] **Étape 1** : sous-titres selon `isAllTime` (textes des **Contraintes globales**).
- [ ] **Étape 2** : tableau des non classés, 1ʳᵉ colonne : `hidden: !isAllTime` ; rendu
      `getUnrankedTag(player)` → `'new'` : `<Tag color="processing">Nouveau</Tag>`, `'inactive'` : `<Tag>Inactif</Tag>`.
      La numérotation `index + 1` disparaît partout.
- [ ] **Étape 3** : colonne « Elo » des non classés : `isAllTime && player.currentElo !== null` →
      `<Tag variant="outlined">{player.currentElo}</Tag>`, sinon le placeholder flouté actuel, dont le `style` inline
      devient `SeasonStatsBlurredEloText`.
- [ ] **Étape 4** : `SeasonStats.test.tsx` : `vi.mock` du module `useStats.ts` (`useGetGlobalStats` renvoie
      `{ isLoading: false, data }`), rendu par `renderWithProviders`. Les assertions ne portent que sur les titres et le
      tableau des non classés (le tableau des classés est `virtual`, il peut ne rien rendre dans jsdom).
    - `year: 0` : les deux nouveaux sous-titres ; un non classé sans ELO affiche `Nouveau` ; un non classé avec
      `currentElo: 1620` affiche `Inactif` et `1620` ;
    - `year: 0`, tous les joueurs à `rank: 0` : chaque joueur apparaît avec son tag ;
    - `year: 2026, quarter: 3` : anciens sous-titres ; ni `Nouveau` ni `Inactif` ; `1620` absent.
- [ ] **Étape 5** : doc : `SeasonStats.style.tsx` n'est plus vide → `docs/tech-debt.md` passe à 3 `.style.tsx` vides
      sans `SeasonStats`, `project-structure.md` « Quatre » → « Trois ».
- [ ] **Étape 6** : `npm test`, `npm run lint`, `npm run build` → exit 0.
- [ ] **Étape 7** : commit `feat(ranking): tag unranked players on the all-time ranking`.
