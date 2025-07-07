import type {RouteObject} from "react-router-dom";
import {Login} from "../modules/login/Login.tsx";
import {ROUTES} from "./constant.ts";

export const routes: RouteObject[] = [
    {path: ROUTES.HOME, element: <div>Home</div>},
    {path: ROUTES.LOGIN, element: <Login />},
    {path: ROUTES.NOT_FOUND, element: <div>404</div>}
]