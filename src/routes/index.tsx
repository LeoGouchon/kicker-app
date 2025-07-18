import type {RouteObject} from "react-router-dom";
import {Login} from "../modules/login/Login.tsx";
import {ROUTES} from "./constant.ts";
import {WithProtectionRoute} from "../components/withProtectionRoute/WithProtectionRoute.tsx";
import {NotFound} from "../modules/notFound/NotFound.tsx";
import {NewMatch} from "../modules/newMatch/NewMatch.tsx";
import {Stats} from "../modules/stats/Stats.tsx";
import {Players} from "../modules/players/Players.tsx";

export const routes: RouteObject[] = [
    {path: ROUTES.HOME, element: <div>Home</div>},
    {path: ROUTES.LOGIN, element: <Login/>},
    {path: ROUTES.DASHBOARD, element: <Stats/>},
    {path: ROUTES.PLAYER, element: <Players/>},
    {path: ROUTES.NEW_MATCH, element: <WithProtectionRoute><NewMatch/></WithProtectionRoute>},
    {path: ROUTES.NOT_FOUND, element: <NotFound/>}
]