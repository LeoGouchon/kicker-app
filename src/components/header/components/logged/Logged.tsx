import { Button, Flex, message, Popover } from 'antd';
import { type ReactElement, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../../../context/UserContext.tsx';
import { useLogout } from '../../../../hooks/useApiEndPoint/useLogout.ts';
import { useResetElo } from '../../../../hooks/useApiEndPoint/useStats.ts';
import { ROUTES } from '../../../../routes/constant.ts';
import type { UserType } from '../../../../types/User.type.ts';
import { ClickyAvatar } from './Logged.style.tsx';

export const Logged = () => {
    const { user }: { user?: UserType } = useContext(UserContext);
    const logoutMutation = useLogout();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const resetEloMutation = useResetElo();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    const handleResetELO = () => {
        resetEloMutation.mutate(undefined, {
            onSuccess: () => {
                messageApi.open({
                    type: 'success',
                    content: 'Recalcul des ELOs effectué avec succès !',
                });
            },
        });
    };

    const popoverContent: ReactElement = (
        <Flex vertical gap={'small'}>
            {user?.email}
            {user?.admin && (
                <>
                    <Button loading={resetEloMutation.isPending} onClick={handleResetELO}>
                        Recalculer les ELOs
                    </Button>
                    <Button onClick={() => navigate(ROUTES.INVITE)}>Inviter</Button>
                </>
            )}
            <Button onClick={handleLogout} danger>
                Se déconnecter
            </Button>
        </Flex>
    );

    return (
        <>
            <Popover content={popoverContent} placement={'bottom'} trigger={'click'}>
                <ClickyAvatar>{user?.email.slice(0, 1).toUpperCase()}</ClickyAvatar>
            </Popover>
            {contextHolder}
        </>
    );
};
