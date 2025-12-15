import { Layout } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useLocation, useRoutes } from 'react-router-dom';

import { StyledContent, StyledLayout, StyledMainContent } from './App.style';
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

    const isLoginPage = pathname === ROUTES.LOGIN;
    const isInvitePage = pathname === ROUTES.INVITE;
    const isRegisterPage = pathname === ROUTES.REGISTER;

    if (isLoginPage || isInvitePage || isRegisterPage) {
        return <StyledLayout>{routing}</StyledLayout>;
    }

    return (
        <StyledLayout hasSider={!isMobile}>
            {!isMobile && <Sider />}
            <Layout style={{ overflowX: 'hidden' }}>
                <Header />
                <StyledContent isMobile={isMobile}>
                    <StyledMainContent isMobile={isMobile}>{routing}</StyledMainContent>
                </StyledContent>
                <Footer />
            </Layout>
        </StyledLayout>
    );
};
