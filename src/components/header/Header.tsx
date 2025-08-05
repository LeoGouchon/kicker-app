import { useTheme } from '@emotion/react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, Flex, Menu, Tag } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { type MenuItem, useGetMenuItemElements } from '../../hooks/useMenuItems.tsx';
import { ROUTES } from '../../routes/constant.ts';
import { isDev } from '../../utils/envChoice.ts';
import { Logged } from './components/logged/Logged.tsx';
import { ThemeSwitcher } from './components/themeSwitcher/ThemeSwitcher.tsx';
import { StyledHeader } from './Header.style.tsx';

export const Header = () => {
    const navigate = useNavigate();
    const { screenSize } = useTheme();
    const menuItems: MenuItem[] = useGetMenuItemElements();

    const theme = useTheme();

    const isUserLoggedIn = localStorage.getItem('token');

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <StyledHeader>
                {isDev ? <Tag color={'error'}>Dev mode</Tag> : <Tag color={'success'}>Current live!</Tag>}
                <Flex gap={'middle'}>
                    <ThemeSwitcher />
                    {isUserLoggedIn ? (
                        <Logged />
                    ) : (
                        <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>
                            Se connecter
                        </Button>
                    )}
                    {screenSize === 0 && (
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faBars} />}
                            onClick={() => setIsDrawerOpen(true)}
                        />
                    )}
                </Flex>
            </StyledHeader>
            {screenSize === 0 && (
                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    <Menu
                        selectedKeys={[location.pathname]}
                        theme={theme.isDarkTheme ? 'dark' : 'light'}
                        mode="vertical"
                        items={menuItems}
                        onClick={() => setIsDrawerOpen(false)}
                    />
                </Drawer>
            )}
        </>
    );
};
