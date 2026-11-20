# Tests

Quand écrire un test, où le ranger et comment l'écrire avec Vitest et Testing Library. Le pourquoi de ces choix est
dans l'[ADR 0007](../decisions/0007-tests-automatises.md).

## Fichiers clés

- `vite.config.ts` : bloc `test` (jsdom, fichiers inclus, setup, fuseau `UTC`).
- `src/test/setup.ts` : matchers `jest-dom`, simulation de `window.matchMedia`, nettoyage après chaque test.
- `src/test/renderWithProviders.tsx` : rendu d'un composant avec ses providers.
- `src/utils/roles.test.ts` : exemple de test de logique pure.
- `src/components/matchLine/MatchLine.test.tsx` : exemple de test de composant, avec horloge figée.

## Quand un test est obligatoire

- **Logique pure** créée ou modifiée (`.utils`, `.reducer`, `src/utils/`) : un test est **obligatoire**. C'est la
  raison pour laquelle la logique sort des composants dans des fichiers satellites.
- **Composant** : au cas par cas. Un test se justifie quand le rendu dépend d'une règle (rôle, état, format) qu'un
  relecteur ne verrait pas d'un coup d'œil.
- **Hooks de données** (TanStack Query) : pas couverts pour l'instant, en attente d'un ADR sur le mock HTTP.
- Le TDD n'est pas imposé : le test peut venir après le code, dans la même PR.

## Emplacement et nommage

Le test est **colocalisé** : même dossier, même nom, suffixe `.test` avant l'extension.

| Fichier testé             | Test                           |
| ------------------------- | ------------------------------ |
| `roles.ts`                | `roles.test.ts`                |
| `MatchLine.tsx`           | `MatchLine.test.tsx`           |
| `EnhancedTable.utils.tsx` | `EnhancedTable.utils.test.tsx` |

Vitest ne lit que `src/**/*.test.{ts,tsx}`. Les tests sont typés par `npm run build` et lintés par `npm run lint`,
comme le reste du code.

## Écrire un test

- **Imports explicites** depuis `vitest` : `describe`, `it`, `expect`, `vi`, `beforeEach`… Les globals sont désactivés.
- **Langue** : `describe` et `it` en anglais, sous la forme « returns / when … ». Les textes d'interface attendus
  restent en français, tels qu'ils s'affichent.
- **Un `describe` par fonction ou composant**, et `it.each` pour une table de cas.
- **Fabriques locales** (`buildMatch`, `buildRow`) pour les données, avec des `overrides` : chaque test ne montre que
  ce qui compte pour lui.

```ts
describe('isAdmin', () => {
    it.each<[string, UserWithRole, boolean]>([
        ['an admin', { role: 'ADMIN' }, true],
        ['a user', { role: 'USER' }, false],
        ['null', null, false],
    ])('returns the expected value for %s', (_, user, expected) => {
        expect(isAdmin(user)).toBe(expected);
    });
});
```

## Tester un composant

- **Rendu** : toujours par `renderWithProviders(ui, { route })`. Il fournit un `QueryClient` neuf (sans `retry`), un
  `MemoryRouter` et le `ThemeProvider` de l'app (antd et emotion). Il renvoie aussi `user`, issu de
  `userEvent.setup()`.
- **Requêtes** : par rôle (`getByRole('link', { name: 'Léo G.' })`) ou par texte visible (`getByText`), comme
  l'utilisateur. Jamais par classe CSS ; `data-testid` seulement si aucun rôle ni texte ne convient.
- **Interactions** : `await user.click(...)`, `await user.type(...)` plutôt que `fireEvent`.
- **Assertions** : matchers `jest-dom` (`toBeInTheDocument`, `toHaveTextContent`, `toBeDisabled`…).
- **Responsive** : `matchMedia` répond toujours `false`, donc `useBreakpoint` donne le rendu mobile.

```tsx
renderWithProviders(<MatchLine match={buildMatch()} />);

expect(screen.getAllByRole('link')).toHaveLength(4);
```

## Dates et fuseau horaire

Un test ne dépend ni de la machine ni du jour où il tourne.

- **Fuseau** : la config fixe `TZ=UTC` pour toute la suite. Écrire les dates en ISO avec `Z`.
- **Horloge** : un test qui lit l'heure courante la fige.

```ts
beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-20T12:00:00Z'));
});

afterEach(() => {
    vi.useRealTimers();
});
```

`toFake: ['Date']` ne fige que la date : les timers restent réels, ce qui évite de bloquer antd ou `user-event`.

## Isolation

Le setup appelle `cleanup()` et `localStorage.clear()` après chaque test : aucun DOM ni stockage ne passe d'un test à
l'autre. Un test ne dépend jamais de l'ordre d'exécution.

## Un test révèle un bug

Si la PR ne doit pas changer de comportement (outillage, refactoring) :

1. le test décrit le comportement **attendu** et passe en `it.skip`, avec un commentaire
   `// Pending: docs/tech-debt.md, "<sujet>"` ;
2. le bug est ajouté à [../tech-debt.md](../tech-debt.md) ;
3. le correctif vient dans sa propre PR `fix`, qui réactive le test.

Sinon, on corrige le bug dans la PR et le test reste actif.

## Commandes

```bash
npm test                # toute la suite, une fois (c'est aussi ce que lance la CI)
npm run test:watch      # en continu pendant le développement
npx vitest run <chemin> # un seul fichier ou dossier
```

## État dans le code

✅ Appliqué dans tous les tests existants. ⚠️ Deux tests en attente pour des bugs listés dans
[../tech-debt.md](../tech-debt.md) (`getReturnTo`, `getQuarterChanges`).
