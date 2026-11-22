# Thème, style et rendu

Comment le thème clair/sombre est appliqué, comment le style est écrit, et quelles librairies servent aux icônes,
graphiques et dates.

## Fichiers clés

- `src/context/ThemeProvider.tsx` : `ConfigProvider` antd, `AntdApp`, thème emotion, hook `useAntdTheme()`.
- `src/App.style.tsx` : layout global et primitive `FlexFullWidth`.
- `src/components/typography/Typography.style.tsx` : `TitleWithoutMargin`, `LinkTypographyStyled`.
- `src/index.css` : reset du `body` (seul CSS global réellement importé).
- `src/utils/chart.ts` : helpers chart.js ; `src/main.tsx` : enregistrement des modules chart.js.

## Thème

- `ThemeProvider` stocke `'light' | 'dark'` dans `localStorage.theme` et l'expose via
  `useAntdTheme()` → `{ isDarkTheme, toggleTheme }`. Le sélecteur est `header/components/themeSwitcher`.
- `ConfigProvider` applique `algorithm: darkAlgorithm | defaultAlgorithm` et **`cssVar: {}`** : les tokens antd sont
  disponibles en variables CSS (`--ant-color-bg-container`, `--ant-border-radius-lg`…). Aucun token n'est surchargé.
- Variables propres au projet, injectées via `ConfigProvider tag={{ style }}` :
    - `--kicker-tag-{gold,silver,bronze,top,bottom}-{bg,color}` ;
    - utilisées par les tags de classement (`EnhancedTable.style.tsx`).
- `<AntdApp>` fournit le contexte de `App.useApp()` (`message`, `modal`, `notification`).
- Le thème emotion (`isDarkTheme`) est fourni mais n'est lu par aucun composant stylé.

## Écrire du style

On utilise `styled` de `@emotion/styled`, le plus souvent pour habiller un composant antd. Les couleurs et rayons
viennent des variables CSS antd :

```ts
export const StyledMainContent = styled.div<{ ismobile: boolean }>`
    background-color: var(--ant-color-bg-container);
    border-radius: var(--ant-border-radius-lg);
`;
```

- **Surcharger un style antd** : doubler le sélecteur avec `&& { … }` pour gagner en spécificité, par exemple dans
  `TitleWithoutMargin`.
- **Lire un token en JavaScript** (cas de chart.js) : `const { token } = theme.useToken();`, utilisé par
  `EloEvolution`, `GlobalElo` et `SeasonedElo`.
- **Primitives partagées** :
    - `FlexFullWidth` : `Flex` en `width: 100%`, racine habituelle d'une page ;
    - `TitleWithoutMargin` : titre de page (`Title level={2}` sans marge).

Les règles à suivre (nommage, interdiction du style inline, couleurs) sont dans
[../conventions/styling.md](../conventions/styling.md).

## Responsive

- Il n'y a pas de media queries. Les composants lisent le breakpoint antd :
    ```ts
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    ```
- `isMobile` est passé en prop (`ismobile`) aux composants stylés.
- Sous `md`, le `Sider` disparaît et le menu passe dans un Drawer du `Header`.

## Icônes

- FontAwesome partout : `<FontAwesomeIcon icon={faHouse} />`, depuis les paquets `free-solid`, `free-regular` et
  `free-brands`.
- Seule exception : `LoadingOutlined` d'`@ant-design/icons` dans `AppContent.tsx`.

## Graphiques

- **chart.js** via `react-chartjs-2` (`<Line>`), dans `player/components/Elo/` (`GlobalElo`, `SeasonedElo`).
- **Configuration** :
    - les modules (échelles, éléments, tooltip, légende, annotation) sont enregistrés **une fois** dans `main.tsx` ;
    - les options de base sont construites dans `EloEvolution.tsx` à partir des tokens antd.

## Dates

- **Affichage** : surtout l'API native, `toLocaleDateString('fr-FR')` et `Intl.DateTimeFormat('fr-FR')`.
- **`dayjs`** : utilisé uniquement là où antd l'impose (`DatePicker` de `KickerMatchCodes`).
- **Saisons** : le calcul année/trimestre (« saison ») est réimplémenté à plusieurs endroits
  (voir [../tech-debt.md](../tech-debt.md)).
