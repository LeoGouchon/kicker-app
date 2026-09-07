import { Button, Result, Spin } from 'antd';
import { type JSX, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { login } from '../../auth/client.ts';
import { UserContext } from '../../context/UserContext.tsx';
import { isModeratorOrAdmin } from '../../utils/roles.ts';

export const WithProtectionRoute = ({
    isAdminRestricted = false,
    children,
}: {
    isAdminRestricted?: boolean;
    children: JSX.Element;
}) => {
    const { user, authState } = useContext(UserContext);
    const location = useLocation();

    if (authState === 'initializing') {
        return <Spin description="Vérification de la connexion…" />;
    }

    if (authState !== 'authenticated' || !user) {
        return (
            <Result
                status="info"
                title="Connexion requise"
                subTitle="Connectez-vous pour accéder à cette page."
                extra={
                    <Button
                        type="primary"
                        onClick={() => void login(`${location.pathname}${location.search}${location.hash}`)}
                    >
                        Se connecter
                    </Button>
                }
            />
        );
    }

    if (isAdminRestricted && !isModeratorOrAdmin(user)) {
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
