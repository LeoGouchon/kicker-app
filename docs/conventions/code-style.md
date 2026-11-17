# Style de code et TypeScript

Règles de forme valables pour tout fichier `.ts`/`.tsx`. Le formatage est automatisé : on ne débat pas de ce que
Prettier ou ESLint corrigent.

## Fichiers clés

- `.prettierrc` : 4 espaces, 120 colonnes, quotes simples, point-virgule, `trailingComma: es5`.
- `eslint.config.js` : `@eslint/js` + `typescript-eslint` recommended, `react-hooks`, `react-refresh`,
  `simple-import-sort`, `unused-imports`, `eslint-config-prettier`.
- `tsconfig.app.json` : `strict`, `verbatimModuleSyntax`, `allowImportingTsExtensions`, `erasableSyntaxOnly`.
- `package.json` (`lint-staged`) : `eslint --fix` + `prettier --write` au pre-commit (husky).

## Outillage

- **Formatage** : ne pas reformater à la main. Le hook de pre-commit corrige, et `npm run lint` doit finir sans erreur.
- **Désactiver une règle ESLint** : seulement sur une ligne (`eslint-disable-next-line`) et avec un commentaire
  qui explique pourquoi. Même règle pour `@ts-expect-error`. ⚠️ `SeasonChoice.tsx` déroge.
- **Imports** : leur ordre est géré par `simple-import-sort`, et les imports inutilisés sont supprimés
  automatiquement.

## Imports

- **React** : importer ce dont on a besoin depuis `'react'`. Jamais `React.useState`, `React.memo`, `React.FC`,
  `React.ReactNode`, ni `import React from 'react'` : le JSX transform (`jsx: react-jsx`) n'en a pas besoin.
    ```ts
    import { memo, type ReactNode, useState } from 'react';
    ```
    ⚠️ Une dizaine de fichiers utilisent encore `React.*`.
- **Types** : `import type { Match } from '../../types/Match.type.ts';`, ou `type` en ligne dans un import mixte.
  C'est imposé par `verbatimModuleSyntax`.
- **Extensions** : toujours explicites (`.ts`/`.tsx`) dans les imports relatifs. ✅ C'est la norme ; ⚠️ quelques
  imports n'en ont pas (`AppContent.tsx`).
- **antd** : importer depuis `'antd'` et ne pas importer depuis `antd/es/...` ou `antd/lib/...` (chemins internes
  non garantis) :
    ```ts
    import { Grid, type TableProps } from 'antd';
    const { useBreakpoint } = Grid;
    ```
    ⚠️ `antd/es/grid/hooks/useBreakpoint` est importé dans une dizaine de fichiers.

## TypeScript

- **`strict` partout.** Pas de `any`. Utiliser `unknown` et affiner le type si besoin.
- **Pas d'`enum`** (interdit par `erasableSyntaxOnly`). Utiliser un objet `as const` et un type union du même nom :
    ```ts
    export const UserRole = { Admin: 'ADMIN', Moderator: 'MODERATOR', User: 'USER' } as const;
    export type UserRole = (typeof UserRole)[keyof typeof UserRole];
    ```
    Ou une simple union quand il n'y a pas besoin de valeurs au runtime :
    `type AuthState = 'initializing' | 'authenticated'`. ✅
- **`type` plutôt qu'`interface`.** `interface` est réservé à l'augmentation de module (`declare module 'axios'`,
  `emotion.d.ts`). ⚠️ `UserContextType` et `ThemeContextType` sont encore des `interface`.
- **Pas d'assertion non-null `!`** pour masquer un cas possible. Valider la donnée, ou utiliser `enabled` dans une
  query. Exception tolérée : `document.getElementById('root')!` dans `main.tsx`.
- **Type de retour explicite** pour les fonctions exportées de `utils` et les `queryFn` (`Promise<T>`).

## Nommage

| Élément                | Convention                              | Exemple                             |
| ---------------------- | --------------------------------------- | ----------------------------------- |
| Variables, fonctions   | camelCase                               | `formattedDate`, `getCurrentSeason` |
| Composants, types      | PascalCase                              | `MatchCard`, `Pagination<T>`        |
| Constantes de module   | SCREAMING_SNAKE_CASE                    | `ROUTES`, `DELETE_MATCH_DAYS`       |
| Hooks                  | `use` + PascalCase                      | `useGetMatches`, `useAntdTheme`     |
| Booléens               | préfixe `is` / `has` / `can` / `should` | `isMobile`, `hasRole`               |
| Props de callback      | `on` + événement                        | `onSelect`, `onChange`              |
| Gestionnaires internes | `handle` + événement                    | `handleCardClick`                   |

Le nom d'un fichier correspond à son export principal : `useMenuItems.tsx` doit exporter `useMenuItems`. ⚠️ Il
exporte aujourd'hui `useGetMenuItemElements`.

## Langue

- **Anglais** : identifiants, commentaires, messages de commit, messages `console`.
- **Français** : textes affichés à l'utilisateur (accents corrects : « Général », pas « General ») et documentation.
- Pas d'identifiants en français. ⚠️ Les champs `joueurA1…` de `MatchForm` font exception.

## Commentaires

- Un commentaire explique **pourquoi**, pas **quoi**. Par exemple, le commentaire de `client.ts` sur le double
  montage `StrictMode`.
- Pas de code commenté laissé en place. Pas de `console.log` dans le code livré (`console.error` toléré pour un
  vrai cas d'erreur inattendue).

## Références

- React, TypeScript : <https://react.dev/learn/typescript>
- typescript-eslint : <https://typescript-eslint.io/rules/>
