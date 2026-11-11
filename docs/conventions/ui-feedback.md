# Feedback utilisateur

Comment informer l'utilisateur : messages, confirmations, et états de chargement, vide et erreur.

## Fichiers clés

- `src/context/ThemeProvider.tsx` : `<AntdApp>` qui rend `App.useApp()` disponible partout.
- `src/modules/player/components/GameHistory.tsx` : exemple complet des états erreur, chargement et vide.
- `src/modules/kickerMatchCodes/KickerMatchCodes.tsx` : exemple de mutation avec message et spinner par ligne.
- `src/modules/publicNewMatch/PublicNewMatch.tsx` : extraction du message d'erreur de l'API.

## Une seule API : `App.useApp()`

```ts
const { message, modal, notification } = App.useApp();
```

- **Pourquoi** : la doc antd recommande `App.useApp()`. Les méthodes statiques (`message.success()` importé
  d'`antd`) ne reçoivent pas le contexte du `ConfigProvider` (thème sombre, tokens). `useMessage()` oblige à rendre
  un `contextHolder` dans chaque composant. Voir [App](https://ant.design/components/app).
- **À ne pas utiliser** : `message.useMessage()`, `notification.useNotification()`, `Modal.confirm` statique.
  ⚠️ `Logged`, `CreatePlayer`, `Invite` et `AppContent` utilisent encore `useMessage` ou `useNotification`.
- **Quel outil pour quel cas** :
    - `message` : retour bref d'une action (succès, erreur) ;
    - `notification` : information longue ou persistante (processus en cours) ;
    - `modal.confirm` : confirmation d'une action.

## États d'une donnée distante

Chaque composant qui lit une query gère quatre états, dans cet ordre :

```tsx
if (isError) {
    return (
        <Result
            status="error"
            title="Impossible de charger l'historique des parties."
            extra={
                <Button type="primary" onClick={() => refetch()}>
                    Réessayer
                </Button>
            }
        />
    );
}
if (isPending) return <MatchCardSkeleton />;
if (matches.length === 0) return <Empty description="Aucun match dans l'historique" />;
return matches.map((match) => <MatchCard key={match.id} match={match} />);
```

| État       | Composant antd                                                                                                    | Règle                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Erreur     | `Result status="error"` + bouton « Réessayer » (`refetch`)                                                        | **Obligatoire** : jamais de spinner infini. ⚠️ `Player.tsx` tourne indéfiniment si la requête échoue |
| Chargement | `Skeleton` (ou `.skeleton.tsx`) pour du contenu, `Spin` pour une attente courte, prop `loading` de `Table`/`Card` | La mise en page ne doit pas sauter                                                                   |
| Vide       | `Empty description="…"`                                                                                           | Texte explicite, pas un tableau vide muet                                                            |
| Données    | Le rendu normal                                                                                                   | —                                                                                                    |

Avec `placeholderData: keepPreviousData`, on garde l'ancien rendu pendant le chargement de la page suivante.

## Actions (mutations)

- **Bouton d'action** : `loading={mutation.isPending}`. Dans une liste, seule la ligne concernée affiche le spinner :
    ```tsx
    loading={revokeCode.isPending && revokeCode.variables === code.id}
    ```
- **Succès** : `message.success('Match supprimé')`. Un formulaire réussi est réinitialisé (`form.resetFields()`) ou
  redirige.
- **Échec** : toujours un `message.error(…)`. Une mutation ne doit jamais échouer en silence. ⚠️ `NewMatch`, le reset
  ELO de `Logged` et `useLogout` échouent sans message.
- **Message d'erreur** : afficher celui de l'API quand il existe, sinon un texte générique :
    ```ts
    const getErrorMessage = (error: unknown, fallback: string) =>
        (axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message) || fallback;
    ```
    Ce helper n'existe que localement dans `PublicNewMatch`. Il est à mutualiser dans `src/utils/` (voir tech-debt).
- **Action destructive** (suppression, révocation, reset) : confirmation obligatoire avec `modal.confirm` :
    ```ts
    modal.confirm({
        title: 'Supprimer ce match ?',
        content: 'Cette action est irréversible.',
        okText: 'Supprimer',
        okButtonProps: { danger: true },
        cancelText: 'Annuler',
        onOk: () => deleteMatch.mutateAsync(match.id),
    });
    ```
    Retourner la promesse dans `onOk` (`mutateAsync`) : la modale affiche alors son propre chargement.

## Textes

- **Langue** : en français, avec les accents, en commençant par une majuscule.
    - Erreur : « Impossible de … ».
    - Succès : participe passé (« Match enregistré »).
- **Boutons** : un verbe à l'infinitif (« Enregistrer », « Réessayer »). Pas de « OK » / « Cancel ».
- **Pas de texte technique** (codes HTTP, stack traces) affiché à l'utilisateur.
