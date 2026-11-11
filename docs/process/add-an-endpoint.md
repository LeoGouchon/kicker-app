# Brancher un nouvel endpoint API

Du contrat backend jusqu'au composant. Les règles détaillées sont dans
[../conventions/api-hooks.md](../conventions/api-hooks.md).

## 1. Typer le contrat

`src/types/<Name>.type.ts` (créer le fichier si la ressource est nouvelle) :

```ts
export type SeasonAward = {
    id: string;
    playerId: string;
    title: string;
    awardedAt: string; // ISO 8601, tel que renvoyé par l'API
};

export type CreateSeasonAwardPayload = Pick<SeasonAward, 'playerId' | 'title'>;
```

Nommer les champs comme l'API les renvoie. Pas d'`interface`, pas d'`enum`.

## 2. Créer ou compléter le fichier de hooks

`src/hooks/api/useSeasonAward.ts`. Pendant la transition, un fichier existant reste dans
`src/hooks/useApiEndPoint/`.

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CreateSeasonAwardPayload, SeasonAward } from '../../types/SeasonAward.type.ts';
import { api } from '../../utils/api.ts';

export const seasonAwardKeys = {
    all: ['season-awards'] as const,
    list: (season: string) => [...seasonAwardKeys.all, 'list', { season }] as const,
};

export const useGetSeasonAwards = (season: string) =>
    useQuery({
        queryKey: seasonAwardKeys.list(season),
        queryFn: async (): Promise<SeasonAward[]> => {
            const { data } = await api.get('/kicker/season-awards', { params: { season } });
            return data;
        },
        enabled: Boolean(season),
    });

export const useCreateSeasonAward = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateSeasonAwardPayload): Promise<SeasonAward> => {
            const { data } = await api.post('/kicker/season-awards', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: seasonAwardKeys.all }),
    });
};
```

Checklist du hook :

- [ ] la clé contient **toutes** les variables utilisées par la `queryFn` ;
- [ ] la query string passe par `params` (tableaux : `paramsSerializer: { indexes: null }`) ;
- [ ] pas de `try/catch` + `console.error` ;
- [ ] `staleTime` ajusté si la donnée change rarement ;
- [ ] la mutation invalide la ressource **et** ce qui en dépend (stats, ELO, listes liées) ;
- [ ] endpoint public appelé sans session : passer `{ skipAuthRefresh: true }`, sinon un 401 déclenche un logout.

## 3. Consommer dans le composant

```tsx
const { message } = App.useApp();
const createAward = useCreateSeasonAward();

const handleFinish = (values: CreateSeasonAwardPayload) =>
    createAward.mutate(values, {
        onSuccess: () => {
            form.resetFields();
            message.success('Récompense enregistrée');
        },
        onError: (error) => message.error(getErrorMessage(error, "Impossible d'enregistrer la récompense")),
    });

<Button type="primary" htmlType="submit" loading={createAward.isPending}>
    Enregistrer
</Button>;
```

Gérer les états erreur, chargement et vide côté lecture
([../conventions/ui-feedback.md](../conventions/ui-feedback.md)).

## 4. Vérifier

- [ ] Onglet Network : URL et paramètres corrects, en-tête `Authorization` présent (ou absent pour un endpoint public).
- [ ] Après la mutation, toutes les vues concernées se mettent à jour sans recharger la page.
- [ ] Réponse en erreur (4xx/5xx) : un message clair s'affiche, rien ne reste bloqué en chargement.
- [ ] `npm run build` passe : les types du DTO sont cohérents avec leur usage.
