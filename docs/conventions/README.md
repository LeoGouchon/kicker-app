# Conventions

**Visée** : les règles à suivre pour **tout nouveau code** et pour le code qu'on modifie. Elles partent des
recommandations officielles de React, antd et TanStack Query, adaptées au projet.

Chaque fichier suit le même schéma :

- la règle et sa justification en une phrase ;
- un exemple ;
- l'**état dans le code** : ✅ appliqué, ou ⚠️ écart listé dans [../tech-debt.md](../tech-debt.md).

**En cas de conflit** : la convention l'emporte sur le code existant. On ne recopie pas un pattern listé en dette. Si
une règle gêne réellement, on la change ici (dans la même PR, avec un ADR si elle est structurante) plutôt que de la
contourner.

**Quand ajouter un fichier ici** : quand un nouveau domaine de règles apparaît (tests, i18n, accessibilité…). Une
règle isolée va dans le fichier existant le plus proche.

## Sommaire

- [code-style.md](code-style.md) : Prettier/ESLint, imports, TypeScript (pas d'`enum`, `type` vs `interface`),
  nommage des variables, langue.
  _À lire si_ : tu écris du code TypeScript, quel qu'il soit.
- [project-structure.md](project-structure.md) : arborescence cible `src/pages/<page>/`, dossiers en kebab-case,
  fichiers satellites (`.style`, `.utils`, `.reducer`), partagé vs local.
  _À lire si_ : tu crées un fichier ou un dossier, ou tu te demandes où ranger du code.
- [components.md](components.md) : écrire un composant React (props, état, effets, `useReducer`, mémoïsation) et
  utiliser antd.
  _À lire si_ : tu crées ou modifies un composant.
- [styling.md](styling.md) : fichiers `.style.tsx`, nommage `<Composant><Rôle>`, tokens antd, responsive, pas de
  style inline.
  _À lire si_ : tu ajoutes ou modifies du style.
- [api-hooks.md](api-hooks.md) : hooks TanStack Query, fabrique de query keys, paramètres axios, invalidation,
  typage des DTO.
  _À lire si_ : tu appelles l'API ou modifies un hook de données.
- [ui-feedback.md](ui-feedback.md) : `App.useApp()`, états chargement/vide/erreur, confirmations, messages.
  _À lire si_ : tu affiches des données distantes ou déclenches une action utilisateur.
- [testing.md](testing.md) : quand un test est obligatoire, emplacement, Vitest et Testing Library, rendu avec
  providers, dates, bug révélé par un test.
  _À lire si_ : tu écris ou modifies une logique pure ou un test.
- [git-workflow.md](git-workflow.md) : branches, Conventional Commits, PR vers `dev`, release vers `main`.
  _À lire si_ : tu crées une branche, un commit ou une PR.
