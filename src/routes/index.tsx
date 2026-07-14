import type { RouteObject } from 'react-router-dom';

import { WithProtectionRoute } from '../components/withProtectionRoute/WithProtectionRoute.tsx';
import { CreatePlayerPage } from '../modules/createPlayer/CreatePlayerPage.tsx';
import { Dashboard } from '../modules/dashboard/Dashboard.tsx';
import { DuoStatTables } from '../modules/duo/DuoStatTables.tsx';
import { History } from '../modules/history/History.tsx';
import { Invite } from '../modules/invite/Invite.tsx';
import { KickerMatchCodes } from '../modules/kickerMatchCodes/KickerMatchCodes.tsx';
import { Login } from '../modules/login/Login.tsx';
import { MainStats } from '../modules/mainStats/MainStats.tsx';
import { NewMatch } from '../modules/newMatch/NewMatch.tsx';
import { NotFound } from '../modules/notFound/NotFound.tsx';
import { Player } from '../modules/player/Player.tsx';
import { PublicNewMatch } from '../modules/publicNewMatch/PublicNewMatch.tsx';
import { Register } from '../modules/register/Register.tsx';
import { StatHelper } from '../modules/statHelper/StatHelper.tsx';
import { ROUTES } from './constant.ts';

export const uuidRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export const routes: RouteObject[] = [
    { path: ROUTES.HOME, element: <Dashboard /> },
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.HISTORY, element: <History /> },
    {
        path: `${ROUTES.RANKING}/*`,
        element: <MainStats />,
    },
    {
        path: `${ROUTES.PLAYER}/:uuid`,
        element: <Player />,
    },
    {
        path: ROUTES.NEW_MATCH,
        element: (
            <WithProtectionRoute>
                <NewMatch />
            </WithProtectionRoute>
        ),
    },
    { path: ROUTES.PUBLIC_NEW_MATCH, element: <PublicNewMatch /> },
    {
        path: ROUTES.KICKER_MATCH_CODES,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <KickerMatchCodes />
            </WithProtectionRoute>
        ),
    },
    {
        path: ROUTES.CREATE_PLAYER,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <CreatePlayerPage />
            </WithProtectionRoute>
        ),
    },
    {
        path: ROUTES.INVITE,
        element: (
            <WithProtectionRoute isAdminRestricted>
                <Invite />
            </WithProtectionRoute>
        ),
    },
    { path: ROUTES.STATS_HELPER, element: <StatHelper /> },
    { path: ROUTES.REGISTER, element: <Register /> },
    { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    {
        path: ROUTES.DUO,
        element: <DuoStatTables />,
    },
];
