import {Button, Flex, Popover} from 'antd';
import {type ReactElement, useContext} from 'react';
import {useNavigate} from 'react-router-dom';

import {UserContext} from '../../../../context/UserContext.tsx';
import {useLogout} from '../../../../hooks/useApiEndPoint/useLogout.ts';
import {ROUTES} from '../../../../routes/constant.ts';
import type {UserType} from '../../../../types/User.type.ts';
import {ClickyAvatar} from './Logged.style.tsx';

export const Logged = () => {
    const {user}: { user?: UserType } = useContext(UserContext);
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    };

    const popoverContent: ReactElement =
        <Flex vertical gap={'small'}>
            {user?.email}
            {user?.admin &&
                <Button onClick={() => navigate(ROUTES.INVITE)}>Inviter</Button>}
            <Button onClick={handleLogout} danger>Se déconnecter</Button>
        </Flex>;

    return (
        <Popover
            content={popoverContent}
            placement={'bottom'}
            trigger={'click'}
        >
            <ClickyAvatar>{user?.email.slice(0, 1).toUpperCase()}</ClickyAvatar>
        </Popover>
    );
};