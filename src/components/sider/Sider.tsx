import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Menu } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { type MenuItem, useGetMenuItemElements } from '../../hooks/useMenuItems.tsx';
import { StyledSider } from './Sider.style.tsx';

const IS_NAV_LEFT_BAR_OPEN_STORAGE_KEY = 'isNavLeftBarOpen';

export const Sider = () => {
    const [isNavLeftBarOpen, setIsNavLeftBarOpen] = useState(
        () => localStorage.getItem(IS_NAV_LEFT_BAR_OPEN_STORAGE_KEY) === 'true'
    );
    const menuItems: MenuItem[] = useGetMenuItemElements();

    const location = useLocation();

    const selectedKey = menuItems.find((item) => location.pathname.startsWith(item?.key as string))?.key;

    const handleToggleNavLeftBar = () => {
        const newIsNavLeftBarOpen = !isNavLeftBarOpen;

        localStorage.setItem(IS_NAV_LEFT_BAR_OPEN_STORAGE_KEY, String(newIsNavLeftBarOpen));
        setIsNavLeftBarOpen(newIsNavLeftBarOpen);
    };

    return (
        <StyledSider collapsible defaultCollapsed collapsedWidth={60} trigger={null} collapsed={!isNavLeftBarOpen}>
            <div style={{ height: '100%', paddingBottom: '32px' }}>
                <div style={{ height: '100%' }}>
                    <Menu
                        selectedKeys={selectedKey ? [selectedKey as string] : []}
                        theme="dark"
                        mode="inline"
                        items={menuItems}
                    />
                </div>
                <div style={{ height: 'fit-content' }}>
                    <Button
                        block
                        type="primary"
                        style={{ backgroundColor: 'transparent', border: 'none', paddingBottom: '8px' }}
                        icon={
                            isNavLeftBarOpen ? (
                                <FontAwesomeIcon icon={faArrowLeft} />
                            ) : (
                                <FontAwesomeIcon icon={faArrowRight} />
                            )
                        }
                        onClick={handleToggleNavLeftBar}
                    />
                </div>
            </div>
        </StyledSider>
    );
};
