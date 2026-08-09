import { Layout } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useLocation, useRoutes } from 'react-router-dom';

import { StyledContent, StyledLayout, StyledMainContent } from './App.style';
import { AppBreadcrumb } from './components/breadcrumb/AppBreadcrumb.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { Header } from './components/header/Header';
import { Sider } from './components/sider/Sider';
import { routes } from './routes';
import { ROUTES } from './routes/constant.ts';

export const AppContent = () => {
    const routing = useRoutes(routes);
    const { pathname } = useLocation();

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const isAuthCallbackPage = pathname === ROUTES.AUTH_CALLBACK;
    const isInvitePage = pathname === ROUTES.INVITE;

    if (isAuthCallbackPage || isInvitePage) {
        return <StyledLayout>{routing}</StyledLayout>;
    }

    return (
        <StyledLayout hasSider={!isMobile}>
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
