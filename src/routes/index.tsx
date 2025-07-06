import type {RouteObject} from "react-router-dom";
import {Login} from "../modules/login/Login.tsx";

export const routes: RouteObject[] = [
    {path: "/", element: <div>Home</div>},
    {path: "/login", element: <Login />},
    {path: "*", element: <div>404</div>}
]