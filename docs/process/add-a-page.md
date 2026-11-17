# Ajouter une page

Créer une nouvelle URL dans l'application : dossier, composant, route, breadcrumb, menu et protection. Le
fonctionnement du routing est décrit dans [../architecture/routing.md](../architecture/routing.md).

## 1. Créer le dossier de la page

```
src/pages/<page-kebab>/
├── <Page>.tsx
└── <Page>.style.tsx      (si la page a du style)
```

Les nouvelles pages vont directement dans `src/pages/`, même pendant la transition depuis `src/modules/` (voir
[../conventions/project-structure.md](../conventions/project-structure.md)).

```tsx
// src/pages/season-awards/SeasonAwards.tsx
import { Button, Empty, Result, Skeleton } from 'antd';

import { FlexFullWidth } from '../../App.style.tsx';
import { TitleWithoutMargin } from '../../components/typography/Typography.style.tsx';
import { useGetSeasonAwards } from '../../hooks/api/useSeasonAward.ts';
import { SeasonAwardCard } from './components/season-award-card/SeasonAwardCard.tsx';

type SeasonAwardsProps = {
    season: string;
};

export const SeasonAwards = ({ season }: SeasonAwardsProps) => {
    const { data: awards = [], isPending, isError, refetch } = useGetSeasonAwards(season);

    const renderContent = () => {
        if (isError) {
            return (
                <Result
                    status="error"
                    title="Impossible de charger les récompenses."
                    extra={<Button onClick={() => refetch()}>Réessayer</Button>}
                />
            );
        }
        if (isPending) return <Skeleton active />;
        if (awards.length === 0) return <Empty description="Aucune récompense pour cette saison" />;
        return awards.map((award) => <SeasonAwardCard key={award.id} award={award} />);
    };

    return (
        <FlexFullWidth vertical gap="large">
            <TitleWithoutMargin>Récompenses de la saison</TitleWithoutMargin>
            {renderContent()}
        </FlexFullWidth>
    );
};
```

Points communs à toutes les pages :

- racine `FlexFullWidth vertical gap="large"` ;
- titre `TitleWithoutMargin` ;
- export nommé.

## 2. Déclarer le chemin

`src/routes/constant.ts` : ajouter la clé en `SCREAMING_SNAKE_CASE` et le chemin en kebab-case. Les pages
d'administration vont sous `/admin/`.

```ts
SEASON_AWARDS: '/season-awards',
```

## 3. Déclarer la route

`src/routes/index.tsx` :

```tsx
{
    path: ROUTES.SEASON_AWARDS,
    element: <SeasonAwards />,
    breadcrumb: { label: 'Récompenses' },
},
```

- **Page réservée aux connectés** : `element: <WithProtectionRoute><SeasonAwards /></WithProtectionRoute>`.
- **Page réservée aux modérateurs et admins** : ajouter `isAdminRestricted`.
- **Page d'administration** : `breadcrumb: { label: '…', parents: [{ label: 'Admin' }] }`.
- **Paramètre d'URL** :
    - `path: \`${ROUTES.X}/:id\``, lu avec `useParams()` ;
    - valider la valeur, par exemple avec `uuidRegex`, et passer `enabled` à la query tant qu'elle n'est pas valide.

## 4. Ajouter au menu (si la page y figure)

`src/hooks/useMenuItems.tsx` :

```tsx
getItem('Récompenses', ROUTES.SEASON_AWARDS, <FontAwesomeIcon icon={faTrophy} />, () => navigate(ROUTES.SEASON_AWARDS), false),
```

- **Item réservé à un rôle** : `...(isModeratorOrAdmin(user) ? [getItem(…)] : [])`. Le rôle doit être **le même**
  que celui de la route.
- **Libellé** : identique à celui du breadcrumb.
- **Sous-chemins** : vérifier que l'item reste sélectionné, car le `Sider` fait une correspondance par préfixe.

## 5. Page plein écran (rare)

Pour une page sans Sider, Header et Breadcrumb :

- ajouter le chemin à la liste des pages sans shell dans `src/AppContent.tsx` ;
- envelopper le contenu dans `FullscreenPage` (`src/components/fullscreenPage/`).

## 6. Vérifier

- [ ] Accès direct à l'URL (rechargement) : la page s'affiche (Vercel réécrit toutes les URL vers `/`).
- [ ] Breadcrumb correct, item de menu actif sur desktop et dans le Drawer mobile.
- [ ] Chaque rôle voit ou ne voit pas la page comme prévu, y compris en tapant l'URL à la main.
- [ ] Les états erreur, chargement et vide sont gérés.
