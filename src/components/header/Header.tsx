import {StyledHeader} from "./Header.style.tsx";
import {Button, Flex, Tag} from "antd";
import {isDev} from "../../utils/envChoice.ts";
import {ThemeSwitcher} from "./components/themeSwitcher/ThemeSwitcher.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";
import {Logged} from "./components/logged/Logged.tsx";

export const Header = () => {
    const navigate = useNavigate();

    const isUserLoggedIn = localStorage.getItem('token');

    return (
        <StyledHeader>
            {isDev ? <Tag color={'error'}>Dev mode</Tag> : <Tag color={'success'}>Current live!</Tag>}
            <Flex gap={'middle'}>
                <ThemeSwitcher/>
                {
                    isUserLoggedIn
                        ? <Logged/>
                        : <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>Se connecter</Button>
                }
            </Flex>
        </StyledHeader>
    )
}