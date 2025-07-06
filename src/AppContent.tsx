// AppContent.tsx
import {useRoutes} from "react-router-dom";
import {routes} from "./routes";
import {Layout} from "antd";
import {Header} from "./components/header/Header";
import {Sider} from "./components/sider/Sider";
import {StyledContent, StyledLayout, StyledMainContent} from "./App.style";
import {Footer} from "./components/footer/Footer.tsx";

export const AppContent = () => {
    const routing = useRoutes(routes);

    return (
        <StyledLayout>
            <Sider/>
            <Layout>
                <Header/>
                <StyledContent>
                    <StyledMainContent>
                        {routing}
                    </StyledMainContent>
                </StyledContent>
                <Footer />
            </Layout>
        </StyledLayout>
    );
};
