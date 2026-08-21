import { Button, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleLogoutCallback } from '../../auth/client.ts';
import { FullscreenPage } from '../../components/fullscreenPage/FullscreenPage.tsx';

export const LogoutCallbackPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();

    useEffect(() => {
        void handleLogoutCallback()
            .then(() => navigate('/', { replace: true }))
            .catch(() => setError('La réponse de logout est invalide ou son state ne correspond pas.'));
    }, [navigate]);

    return (
        <FullscreenPage>
            {error ? (
                <Result
                    status="error"
                    title="Échec de la déconnexion"
                    subTitle={error}
                    extra={<Button onClick={() => navigate('/', { replace: true })}>Retour à l’accueil</Button>}
                />
            ) : (
                <Spin description="Finalisation de la déconnexion…" />
            )}
        </FullscreenPage>
    );
};
