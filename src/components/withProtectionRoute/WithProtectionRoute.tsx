import { Button, Result, Spin } from 'antd';
import { type JSX, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { login } from '../../auth/client.ts';
import { UserContext } from '../../context/UserContext.tsx';

export const WithProtectionRoute = ({
    isAdminRestricted = false,
    children,
}: {
    isAdminRestricted?: boolean;
    children: JSX.Element;
}) => {
    const { user, authState } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        if (authState !== 'initializing' && authState !== 'authenticated') {
            void login(`${location.pathname}${location.search}${location.hash}`);
        }
    }, [authState, location.hash, location.pathname, location.search]);

    if (authState !== 'authenticated' || !user) {
        return <Spin tip="Redirection vers le service d’identité…" />;
    }

    if (isAdminRestricted && !user.admin) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Vous n’êtes pas autorisé à accéder à cette page."
                extra={
                    <Button type="primary" onClick={() => globalThis.history.back()}>
                        Retourner au menu
                    </Button>
                }
            />
        );
    }

    return children;
};
