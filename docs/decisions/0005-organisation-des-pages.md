# 0005. Organisation des pages et fichiers satellites

- **Statut** : Accepté (migration à faire)
- **Date** : 2026-11-11

## Contexte

Le code est rangé dans `src/modules/<camelCase>/`, sans règle explicite. Résultat :

- des pages importent les composants d'autres pages ;
- des composants partagés restent dans un module ;
- la logique s'accumule dans les composants : longs fichiers, nombreux `useState` ;
- les composants stylés sont nommés de façon hétérogène (`GlobalWrapper` dans trois fichiers, `StyledX`, `XStyled`,
  `WrapperX`).

## Options envisagées

1. **Garder `src/modules/`** et seulement documenter : aucune migration, mais le nom « module » ne dit pas qu'il
   s'agit de pages routées, et les écarts restent.
2. **Organisation par feature** (`features/<domaine>/` avec pages, hooks et API mélangés) : utile pour une grosse
   application, mais excessive ici.
3. **Une page = un dossier `src/pages/<kebab>/`**, avec ses `components/` et `hooks/` locaux. Ce qui est partagé va
   dans `src/components/` et `src/hooks/`.

## Décision

Nous retenons l'option 3 :

- **Dossiers** : tous en **kebab-case** (`pages/kicker-match-codes/`). Les fichiers de composants restent en
  PascalCase.
- **Partage** : un élément utilisé par une 2ᵉ page passe dans `src/components/` ou `src/hooks/`. Une page n'importe
  jamais une autre page.
- **Hooks API** : dans `src/hooks/api/`.
- **Fichiers satellites co-localisés** :
    - `.style.tsx` pour tout le style ;
    - `.utils.tsx` pour la logique pure ;
    - `.reducer.tsx` pour l'état complexe géré par `useReducer` ;
    - `.skeleton.tsx`, `.columns.tsx`, `.type.ts` selon les besoins.
- **Composants stylés** : nommés `<Composant><Rôle>`, avec la racine en `<Composant>Wrapper`.

## Conséquences

- **Positives** :
    - on sait où ranger chaque fichier ;
    - le partage est explicite ;
    - les composants restent courts ;
    - les noms de style sont uniques et faciles à chercher.
- **Négatives** :
    - une migration de tout `src/modules/` est nécessaire ;
    - les chemins cités dans la doc devront être mis à jour (`grep -r "src/modules" docs CLAUDE.md`).
- **Suivi** :
    - migration dans une PR dédiée, listée dans `tech-debt.md` ;
    - d'ici là, toute nouvelle page suit déjà cette organisation ;
    - règles détaillées dans `conventions/project-structure.md` et `conventions/styling.md`.
