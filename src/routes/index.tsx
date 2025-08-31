import type { RouteObject } from 'react-router-dom';

import { WithProtectionRoute } from '../components/withProtectionRoute/WithProtectionRoute.tsx';
import { History } from '../modules/history/History.tsx';
import { Invite } from '../modules/invite/Invite.tsx';
import { Login } from '../modules/login/Login.tsx';
import { MainStats } from '../modules/mainStats/MainStats.tsx';
import { NewMatch } from '../modules/newMatch/NewMatch.tsx';
import { NotFound } from '../modules/notFound/NotFound.tsx';
import { Register } from '../modules/register/Register.tsx';
import { StatHelper } from '../modules/statHelper/StatHelper.tsx';
import { ROUTES } from './constant.ts';

export const routes: RouteObject[] = [
    { path: ROUTES.HOME, element: <History /> },
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.HISTORY, element: <History /> },
    {
        path: `${ROUTES.RANKING}/*`,
        element: <MainStats />,
    },
    {
        path: ROUTES.NEW_MATCH,
        element: (
            <WithProtectionRoute>
                <NewMatch />
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
];
