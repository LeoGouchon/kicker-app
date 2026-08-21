import { LoadingOutlined } from '@ant-design/icons';
import { Layout, notification } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';

import { StyledContent, StyledLayout, StyledMainContent } from './App.style';
import { handleCallback, handleLogoutCallback } from './auth/client.ts';
import { getReturnTo } from './auth/returnTo.ts';
import { AppBreadcrumb } from './components/breadcrumb/AppBreadcrumb.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { Header } from './components/header/Header';
import { Sider } from './components/sider/Sider';
import { UserContext } from './context/UserContext.tsx';
import { routes } from './routes';
import { ROUTES } from './routes/constant.ts';

export const AppContent = () => {
    const routing = useRoutes(routes);
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    const { clearSession } = useContext(UserContext);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const isLoginCallback = params.has('code');
        const isLogoutCallback = !isLoginCallback && params.has('state');

        if (!isLoginCallback && !isLogoutCallback) return;

        const notificationKey = 'authentication-callback';
        api.open({
            key: notificationKey,
            title: isLoginCallback ? 'Connexion en cours' : 'Déconnexion en cours',
            description: 'Veuillez patienter…',
            icon: <LoadingOutlined />,
            duration: 0,
        });

        const callback = isLoginCallback ? handleCallback() : handleLogoutCallback();
        void callback
            .then((result) => {
                api.success({
                    key: notificationKey,
                    title: isLoginCallback ? 'Connexion réussie' : 'Déconnexion réussie',
                    duration: 4,
                });
                if (isLogoutCallback) clearSession();
                const returnTo = isLoginCallback ? getReturnTo((result as { state?: unknown }).state) : '/';
                void navigate(returnTo, { replace: true });
            })
            .catch(() => {
                api.error({
                    key: notificationKey,
                    title: isLoginCallback ? 'Échec de la connexion' : 'Échec de la déconnexion',
                    description: 'La réponse du service d’identité est invalide ou a été annulée.',
                    duration: 0,
                });
            });
    }, [api, clearSession, navigate, search]);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const isAuthCallbackPage = pathname === ROUTES.AUTH_CALLBACK;
    const isLogoutCallbackPage = pathname === ROUTES.AUTH_LOGOUT_CALLBACK;
    const isInvitePage = pathname === ROUTES.INVITE;

    if (isAuthCallbackPage || isLogoutCallbackPage || isInvitePage) {
        return (
            <StyledLayout>
                {contextHolder}
                {routing}
            </StyledLayout>
        );
    }

    return (
        <StyledLayout hasSider={!isMobile}>
            {contextHolder}
            {!isMobile && <Sider />}
            <Layout style={{ overflowX: 'hidden', maxWidth: '1440px' }}>
                <Header />
                <StyledContent ismobile={isMobile}>
                    <StyledMainContent ismobile={isMobile}>
                        <AppBreadcrumb />
                        {routing}
                    </StyledMainContent>
                </StyledContent>
                <Footer />
            </Layout>
        </StyledLayout>
    );
};
