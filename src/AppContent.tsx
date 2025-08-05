import { useTheme } from '@emotion/react';
import { Layout } from 'antd';
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

    const { screenSize } = useTheme();

    const isLoginPage = pathname === ROUTES.LOGIN;
    const isInvitePage = pathname === ROUTES.INVITE;
    const isRegisterPage = pathname === ROUTES.REGISTER;

    if (isLoginPage || isInvitePage || isRegisterPage) {
        return <StyledLayout>{routing}</StyledLayout>;
    }

    return (
        <StyledLayout hasSider={screenSize > 0}>
            {screenSize > 0 && <Sider />}
            <Layout>
                <Header />
                <StyledContent>
                    <StyledMainContent>{routing}</StyledMainContent>
                </StyledContent>
                <Footer />
            </Layout>
        </StyledLayout>
    );
};
