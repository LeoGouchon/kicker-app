import { Alert, Button, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleCallback, login } from '../../auth/client.ts';
import { FullscreenPage } from '../../components/fullscreenPage/FullscreenPage.tsx';

const getReturnTo = (state: unknown): string => {
    if (typeof state !== 'object' || state === null || !('returnTo' in state)) return '/';
    const returnTo = (state as { returnTo?: unknown }).returnTo;
    return typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
};

export const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();

    useEffect(() => {
        void handleCallback()
            .then((user) => navigate(getReturnTo(user.state), { replace: true }))
            .catch(() => setError('La réponse de connexion est invalide ou a été annulée.'));
    }, [navigate]);

    return (
        <FullscreenPage>
            {error ? (
                <Result
                    status="error"
                    title="Échec de la connexion"
                    subTitle={error}
                    extra={<Button onClick={() => void login()}>Réessayer</Button>}
                />
            ) : (
                <Spin description="Finalisation de la connexion…" />
            )}
            {error && <Alert type="warning" title="Aucun token n’a été accepté." showIcon />}
        </FullscreenPage>
    );
};
