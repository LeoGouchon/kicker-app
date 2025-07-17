import {Button, Flex, Popover} from "antd";
import {UserContext} from "../../../../context/UserContext.tsx";
import {type ReactElement, useContext} from "react";
import type {UserType} from "../../../../types/User.type.ts";
import {ClickyAvatar} from "./Logged.style.tsx";
import {useLogout} from "../../../../hooks/useApiEndPoint/useLogout.ts";

export const Logged = () => {
    const {user}: { user?: UserType } = useContext(UserContext);
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    }

    const popoverContent: ReactElement =
        <Flex vertical gap={'small'}>
            {user?.email}
            <Button onClick={handleLogout} danger>Se déconnecter</Button>
        </Flex>;

    return (
        <Popover
            content={popoverContent}
            placement={"bottom"}
            trigger={"click"}
        >
            <ClickyAvatar>{user?.email.slice(0, 1).toUpperCase()}</ClickyAvatar>
        </Popover>
    )
}