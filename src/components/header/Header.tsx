import {Button, Flex, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';

import {ROUTES} from '../../routes/constant.ts';
import {isDev} from '../../utils/envChoice.ts';
import {Logged} from './components/logged/Logged.tsx';
import {ThemeSwitcher} from './components/themeSwitcher/ThemeSwitcher.tsx';
import {StyledHeader} from './Header.style.tsx';

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
    );
};