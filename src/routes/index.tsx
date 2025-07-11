import type {RouteObject} from "react-router-dom";
import {Login} from "../modules/login/Login.tsx";
import {ROUTES} from "./constant.ts";
import {WithProtectionRoute} from "../components/withProtectionRoute/WithProtectionRoute.tsx";
import {NotFound} from "../modules/notFound/NotFound.tsx";
import {NewMatch} from "../modules/newMatch/NewMatch.tsx";

export const routes: RouteObject[] = [
    {path: ROUTES.HOME, element: <div>Home</div>},
    {path: ROUTES.LOGIN, element: <Login/>},
    {path: ROUTES.DASHBOARD, element: <WithProtectionRoute><div>Dashboard</div></WithProtectionRoute>},
    {path: ROUTES.NEW_MATCH, element: <WithProtectionRoute><NewMatch/></WithProtectionRoute>},
    {path: ROUTES.NOT_FOUND, element: <NotFound/>}
]