# Décisions d'architecture (ADR)

**Visée** : garder la trace de **pourquoi** le projet est construit ainsi. Un ADR (Architecture Decision Record)
décrit :

- le contexte d'un choix structurant ;
- la décision prise et les options écartées ;
- ses conséquences.

On ne modifie pas un ADR accepté : on en écrit un nouveau qui le **remplace**, et on met à jour le statut de l'ancien.

**Quand écrire un ADR** :

- ajout ou retrait d'une librairie structurante (état, UI, routing, tests…) ;
- nouveau pattern imposé à tout le code, ou changement d'un pattern existant ;
- choix d'infrastructure (hébergement, authentification, CI) ;
- toute décision qu'un nouvel arrivant pourrait vouloir remettre en cause sans en connaître le contexte.

Pas d'ADR pour un choix local à une feature ni pour un détail de style : ceux-là vont dans les conventions.

**Comment** :

1. Copier [0000-template.md](0000-template.md) en `NNNN-titre-en-kebab.md`, avec le numéro suivant dans `origin/dev`
   à jour. Si une autre PR prend ce numéro avant la tienne, renuméroter au rebase (voir
   [../process/pull-request.md](../process/pull-request.md)).
2. Statut `Proposé` dans la PR, puis `Accepté` au merge.
3. Ajouter la ligne au sommaire ci-dessous.

## Sommaire

| N°                                       | Décision                                                                                                                      | Statut                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [0001](0001-structure-documentation.md)  | Documentation dans `docs/`, sommaires progressifs, 200 lignes visées (découpage proposé), `CLAUDE.md` comme point d'entrée IA | Accepté                     |
| [0002](0002-authentification-oidc.md)    | Authentification OIDC via `oidc-client-ts` (Authorization Code + PKCE), session en `localStorage`                             | Accepté                     |
| [0003](0003-react-query-etat-serveur.md) | TanStack Query comme unique source d'état serveur, pas de store global                                                        | Accepté                     |
| [0004](0004-antd-emotion-style.md)       | antd pour les composants et les tokens, emotion pour le style, FontAwesome pour les icônes                                    | Accepté                     |
| [0005](0005-organisation-des-pages.md)   | Pages dans `src/pages/<kebab>/`, dossiers en kebab-case, satellites `.style` / `.utils` / `.reducer`                          | Accepté (migration à faire) |
| [0006](0006-workflow-feature.md)         | Workflow feature en quatre phases (`/feature`), specs versionnées dans `specs/`, glossaire métier                             | Proposé                     |
| [0007](0007-tests-automatises.md)        | Tests avec Vitest, Testing Library et jsdom, obligatoires pour la logique pure, vérifiés en CI sur chaque PR                  | Proposé                     |

_À lire si_ :

- **0001** : tu modifies la doc ou les instructions pour les agents ;
- **0002** : tu touches à la connexion ou à la session ;
- **0003** : tu envisages un store global ou un autre client de données ;
- **0004** : tu envisages une autre librairie UI ou de style ;
- **0005** : tu crées ou déplaces des fichiers ;
- **0006** : tu modifies le workflow `/feature`, ses skills ou le dossier `specs/` ;
- **0007** : tu écris des tests, tu touches à la CI ou tu remets en cause l'exigence de tests.
