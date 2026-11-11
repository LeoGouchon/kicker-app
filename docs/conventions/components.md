# Composants React et antd

Comment écrire un composant : déclaration, props, état, effets, et usage d'antd. Ces règles reprennent les
[Rules of React](https://react.dev/reference/rules) et la documentation [react.dev](https://react.dev/learn).

## Fichiers clés (exemples à suivre)

- `src/components/linkPlayer/LinkPlayer.tsx` : petit composant partagé, `type LinkPlayerProps`.
- `src/modules/dashboard/Dashboard.tsx` : page avec `FlexFullWidth`, `TitleWithoutMargin` et des sous-cartes.
- `src/modules/player/components/GameHistory.tsx` : gestion complète des états erreur, chargement et vide.

## Déclaration

```tsx
type MatchCardProps = {
    match: Match;
    fullWidth?: boolean;
    onDelete?: (matchId: string) => void;
};

export const MatchCard = ({ match, fullWidth = false, onDelete }: MatchCardProps) => {
    // …
};
```

- **Forme** : fonction fléchée avec **export nommé**, sans `export default`. ✅
- **Props** :
    - `type <Composant>Props` déclaré juste au-dessus du composant, et déstructuré dans la signature avec ses valeurs
      par défaut ;
    - pas de type inline, pas de `type props` en minuscules, pas de `React.FC` ;
    - ⚠️ des types inline subsistent dans environ 12 composants, et `type props` dans `SeasonTag` et `MatchCard`.
- **Un composant exporté par fichier.** Les petits composants internes non exportés sont tolérés s'ils restent courts.
- **`children`** : typé `children: ReactNode`.

## Rendu pur

- Un composant est une **fonction pure** de ses props, de son state et de son contexte. Pendant le rendu :
    - pas d'appel réseau, pas d'écriture dans `localStorage` ;
    - pas de mutation d'objet reçu en prop ou venant du cache TanStack Query (`[...list].sort()` plutôt que
      `list.sort()`).
- **Hooks** : toujours appelés au premier niveau du composant, jamais dans une condition ou une boucle. ESLint
  `react-hooks` le vérifie.
- **Lecture de l'URL** : `useLocation` / `useParams` de react-router, jamais `window.location` ni le `location`
  global. ⚠️ Le `Header` utilise le `location` global.

## État

- **État minimal** : ne pas stocker ce qui se calcule à partir des props ou d'un autre état. Le calculer pendant le
  rendu. Voir [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).
- **Données serveur** : ne jamais les recopier dans un `useState`. On lit la query (voir [api-hooks.md](api-hooks.md)).
- **État complexe** : dès que les `useState` s'accumulent ou dépendent les uns des autres, passer à `useReducer` dans
  un `.reducer.tsx` (critères dans [project-structure.md](project-structure.md#passer-à-un-reducertsx)).
- **Préférences locales** (`localStorage` / `sessionStorage`) :
    - lues dans l'initialiseur de `useState(() => …)` ;
    - écrites dans le handler qui change la valeur ;
    - clé préfixée `kicker.` (ex. `kicker.duo.enhancedTable.filters`).
    - ⚠️ Les clés existantes ne suivent pas cette règle.
- **Contextes** : un contexte s'expose par un hook dédié (`useAntdTheme()`), pas par `useContext(XContext)` dans les
  composants. ⚠️ `UserContext` n'a pas encore de hook.

## Effets

Les effets servent à **synchroniser** le composant avec un système externe : abonnement, API du navigateur, librairie
non React. Ils ne servent pas à dériver des données ni à réagir à un clic. Voir
[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

| Besoin                                       | À faire                       | À éviter                                        |
| -------------------------------------------- | ----------------------------- | ----------------------------------------------- |
| Valeur dérivée des props/state               | la calculer pendant le rendu  | `useEffect` + `setState`                        |
| Remettre l'état à zéro quand une prop change | `key={uuid}` sur le composant | `useEffect(() => setPage(1), [uuid])`           |
| Réagir à une action utilisateur              | le faire dans le handler      | un effet qui surveille un state « déclencheur » |
| Charger des données                          | une query TanStack            | `useEffect` + `api.get`                         |

⚠️ `GameHistory`, `EnhancedTable` et `SeasonedElo` utilisent des effets pour de l'état dérivé.

## Mémoïsation

`memo`, `useMemo` et `useCallback` sont des **optimisations**, pas des valeurs par défaut. On les ajoute :

- quand un problème de performance est constaté ;
- ou pour stabiliser une valeur passée à une dépendance d'effet ou à un composant mémoïsé.

Sinon, le code reste simple. Le cas échéant, `memo` est importé depuis `'react'` : jamais `React.memo`. Le
`displayName` est inutile avec une fonction nommée.

## Listes

- `key` stable et unique issue de la donnée (`match.id`).
- L'index n'est accepté que pour des listes statiques, par exemple des skeletons.

## Utiliser antd

- **Composants antd d'abord.** Avant d'écrire un composant stylé, utiliser ce qu'antd fournit :
    - mise en page : `Flex`, `Space`, `Card`, `Typography` ;
    - états : `Result`, `Empty`, `Skeleton`, `Spin`.
- **Typography** : `const { Title, Text } = Typography;` au niveau du module.
    - Titre de page : `TitleWithoutMargin`.
    - Titre de section : `Title level={4}`, sans marge via un composant stylé, pas via `style`.
- **Formulaires** :
    - `Form` + `Form.useForm()` ;
    - validation déclarative via `rules` ;
    - valeurs typées : `Form<MatchFormValues>`, `onFinish={(values: MatchFormValues) => …}`.
    - Ne pas rappeler `validateFields()` dans `onFinish`.
- **Responsive** : `const { useBreakpoint } = Grid;` puis `const isMobile = !useBreakpoint().md;`.
- **Feedback** (messages, modales, notifications) : voir [ui-feedback.md](ui-feedback.md).
- **Icônes** : FontAwesome uniquement (`<FontAwesomeIcon icon={faX} />`).
- **Props antd v6** : utiliser les noms d'API actuels. Par exemple, `Divider orientation="vertical"` et non `type`
  (déprécié). ⚠️ `SeasonChoice.tsx` utilise encore `type`.

## Références

- Rules of React : <https://react.dev/reference/rules>
- antd, composants : <https://ant.design/components/overview>
