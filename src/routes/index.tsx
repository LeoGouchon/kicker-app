import type {RouteObject} from 'react-router-dom';

import {WithProtectionRoute} from '../components/withProtectionRoute/WithProtectionRoute.tsx';
import {Invite} from '../modules/invite/Invite.tsx';
import {Login} from '../modules/login/Login.tsx';
import {NewMatch} from '../modules/newMatch/NewMatch.tsx';
import {NotFound} from '../modules/notFound/NotFound.tsx';
import {Players} from '../modules/players/Players.tsx';
import {Register} from '../modules/register/Register.tsx';
import {Stats} from '../modules/stats/Stats.tsx';
import {ROUTES} from './constant.ts';

export const routes: RouteObject[] = [
    {path: ROUTES.HOME, element: <Stats/>},
    {path: ROUTES.LOGIN, element: <Login/>},
    {path: ROUTES.HISTORY, element: <Stats/>},
    {path: ROUTES.RANKING, element: <WithProtectionRoute isAdminRestricted><Players/></WithProtectionRoute>},
    {path: ROUTES.NEW_MATCH, element: <WithProtectionRoute><NewMatch/></WithProtectionRoute>},
    {path: ROUTES.INVITE, element: <WithProtectionRoute isAdminRestricted><Invite/></WithProtectionRoute>},
    {path: ROUTES.REGISTER, element: <Register/>},
    {path: ROUTES.NOT_FOUND, element: <NotFound/>}
];