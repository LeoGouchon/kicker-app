# Style

Règles pour écrire du style. Le fonctionnement du thème est décrit dans
[../architecture/styling.md](../architecture/styling.md).

## Fichiers clés

- `src/context/ThemeProvider.tsx` : thème antd (algorithme, `cssVar`) et variables `--kicker-*`.
- `src/App.style.tsx` : `FlexFullWidth`, primitive de mise en page partagée.
- `src/components/typography/Typography.style.tsx` : `TitleWithoutMargin`.

## Où écrire le style

- **Tout le style d'un composant `Xxx` est dans `Xxx.style.tsx`**, à côté de lui.
- **Pas de `style={{ … }}` inline**, même pour une seule propriété : on crée un composant stylé. ⚠️ Environ 70
  occurrences existent.
- **Pas de CSS global** hors `src/index.css` (reset). Pas de nouveau fichier `.css`.
- **Sous-composant** : il a son propre `.style.tsx`. Il n'importe pas le `.style.tsx` de son parent, sauf pour une
  primitive vraiment commune, qui doit alors aller dans `src/components/`.

## Nommage : `<Composant><Rôle>`

Le préfixe est le nom du composant qui possède le fichier `.style.tsx` (page ou sous-composant). Le suffixe décrit
le rôle de l'élément.

```tsx
// MatchCard.style.tsx
export const MatchCardWrapper = styled(Card)`…`; // élément racine : <Composant>Wrapper
export const MatchCardHeader = styled(Flex)`…`; // rôle dans le composant
export const MatchCardScoreTag = styled(Tag)`…`; // habille un composant antd : son nom en suffixe
```

- **Racine** : `<Composant>Wrapper`.
- **Habillage d'un composant antd** : son nom en suffixe (`…Tag`, `…Card`, `…Title`).
- **Interdits** :
    - noms génériques sans préfixe (`GlobalWrapper`, `CardContent`) ;
    - préfixe `Styled` ;
    - suffixe `Styled` ;
    - ordre inversé (`WrapperTeamSelection`).

    ⚠️ Le code existant mélange toutes ces formes.

- **Primitive partagée** (dans `src/components/`) : nommée d'après son comportement, comme `FlexFullWidth` ou
  `TitleWithoutMargin`.

## Couleurs, espacements et tokens

- **Couleurs et rayons** : uniquement via les tokens antd en variables CSS, comme `var(--ant-color-text-secondary)`,
  `var(--ant-color-bg-container)` ou `var(--ant-border-radius-lg)`. Ces variables suivent le thème clair/sombre
  automatiquement.
- **Couleur métier** (médailles, tendances) : ajouter une variable `--kicker-*` dans `ThemeProvider`, avec ses
  valeurs claire et sombre.
- **Pas de couleur en dur** (`'green'`, `#444444`, `rgba(...)` dans un composant). ⚠️ Plusieurs fichiers en
  contiennent, dont `SeasonStats` et `StatHelper.style.tsx`.
- **En JavaScript** (options chart.js…) : `const { token } = theme.useToken();`.
- **Espacements** : préférer les props antd (`gap="small" | "middle" | "large"`, `Flex vertical`) ou les tokens
  (`var(--ant-margin-sm)`) aux valeurs en pixels.

## Surcharger antd

Par ordre de préférence :

1. une prop du composant (`size`, `type`, `variant`…) ;
2. un token de composant via `ConfigProvider theme={{ components: { … } }}` (voir
   [Customize Theme](https://ant.design/docs/react/customize-theme)) ;
3. un composant stylé avec le sélecteur doublé `&& { … }` pour gagner en spécificité ;
4. en dernier recours, un sélecteur `.ant-*` imbriqué, commenté.

**Pas de `!important`.** ⚠️ Une douzaine d'occurrences existent.

## Props des composants stylés

Une prop qui ne sert qu'au style ne doit pas arriver dans le DOM. On la filtre avec `shouldForwardProp` :

```tsx
export const MatchCardScore = styled(Typography.Text, {
    shouldForwardProp: (prop) => prop !== 'isWinner',
})<{ isWinner: boolean }>`
    color: ${({ isWinner }) => (isWinner ? 'var(--ant-color-success)' : 'var(--ant-color-text)')};
`;
```

⚠️ Aujourd'hui, `ismobile` est transmis au DOM sans filtrage.

## Responsive

- Le breakpoint vient d'antd : `const { useBreakpoint } = Grid;` puis `const isMobile = !useBreakpoint().md;`.
- Pour adapter le style, passer `isMobile` en prop filtrée (voir ci-dessus).
- Pas de media query codée en dur avec des pixels.
- Vérifier chaque écran sous `md` (mobile) et au-dessus.

## Références

- antd, thème et tokens : <https://ant.design/docs/react/customize-theme>
- Emotion, `styled` : <https://emotion.sh/docs/styled>
