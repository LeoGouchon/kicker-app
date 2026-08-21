import type { RouteObject } from 'react-router-dom';

import { WithProtectionRoute } from '../components/withProtectionRoute/WithProtectionRoute.tsx';
import { AuthCallbackPage } from '../modules/auth/AuthCallbackPage.tsx';
import { LogoutCallbackPage } from '../modules/auth/LogoutCallbackPage.tsx';
import { CreatePlayerPage } from '../modules/createPlayer/CreatePlayerPage.tsx';
import { Dashboard } from '../modules/dashboard/Dashboard.tsx';
import { DuoStatTables } from '../modules/duo/DuoStatTables.tsx';
import { History } from '../modules/history/History.tsx';
import { Invite } from '../modules/invite/Invite.tsx';
import { KickerMatchCodes } from '../modules/kickerMatchCodes/KickerMatchCodes.tsx';
import { MainStats } from '../modules/mainStats/MainStats.tsx';
import { NewMatch } from '../modules/newMatch/NewMatch.tsx';
import { NotFound } from '../modules/notFound/NotFound.tsx';
import { Player } from '../modules/player/Player.tsx';
import { PublicNewMatch } from '../modules/publicNewMatch/PublicNewMatch.tsx';
import { StatHelper } from '../modules/statHelper/StatHelper.tsx';
import { ROUTES } from './constant.ts';

export const uuidRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export type BreadcrumbConfig = {
    label: string;
    parents?: { label: string; path?: string }[];
};

type AppRouteObject = RouteObject & {
    breadcrumb?: BreadcrumbConfig;
};

export const routes: AppRouteObject[] = [
    { path: ROUTES.HOME, element: <Dashboard />, breadcrumb: { label: 'Accueil' } },
    { path: ROUTES.AUTH_CALLBACK, element: <AuthCallbackPage /> },
    { path: ROUTES.AUTH_LOGOUT_CALLBACK, element: <LogoutCallbackPage /> },
    { path: ROUTES.HISTORY, element: <History />, breadcrumb: { label: 'Historique' } },
    {
        path: `${ROUTES.RANKING}/*`,
        element: <MainStats />,
        breadcrumb: { label: 'Classement' },
    },
    {
        path: `${ROUTES.PLAYER}/:uuid`,
        element: <Player />,
        breadcrumb: { label: 'Joueur' },
    },
    {
        path: ROUTES.NEW_MATCH,
        element: (
            <WithProtectionRoute>
                <NewMatch />
            </WithProtectionRoute>
        ),
        breadcrumb: { label: 'Nouveau match' },
    },
    { path: ROUTES.PUBLIC_NEW_MATCH, element: <PublicNewMatch />, breadcrumb: { label: 'Nouveau match' } },
    {
        path: ROUTES.KICKER_MATCH_CODES,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <KickerMatchCodes />
            </WithProtectionRoute>
        ),
        breadcrumb: { label: 'Codes matchs', parents: [{ label: 'Admin' }] },
    },
    {
        path: ROUTES.CREATE_PLAYER,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <CreatePlayerPage />
            </WithProtectionRoute>
        ),
        breadcrumb: { label: 'Créer joueur', parents: [{ label: 'Admin' }] },
    },
    {
        path: ROUTES.INVITE,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <Invite />
            </WithProtectionRoute>
        ),
    },
    { path: ROUTES.STATS_HELPER, element: <StatHelper />, breadcrumb: { label: 'Mathématiques' } },
    { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    {
        path: ROUTES.DUO,
        element: <DuoStatTables />,
        breadcrumb: { label: 'Duo' },
    },
];

export const breadcrumbRoutes = routes.flatMap(({ path, breadcrumb }) =>
    path && breadcrumb
        ? [
              {
                  path,
                  ...breadcrumb,
              },
          ]
        : []
);
