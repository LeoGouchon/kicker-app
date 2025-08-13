import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Menu } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { type MenuItem, useGetMenuItemElements } from '../../hooks/useMenuItems.tsx';
import { StyledSider } from './Sider.style.tsx';

export const Sider = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const menuItems: MenuItem[] = useGetMenuItemElements();

    const location = useLocation();

    const selectedKey = menuItems.find((item) => location.pathname.startsWith(item?.key as string))?.key;

    return (
        <StyledSider collapsible defaultCollapsed collapsedWidth={60} trigger={null} collapsed={isCollapsed}>
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
                        icon={
                            isCollapsed ? (
                                <FontAwesomeIcon icon={faArrowRight} />
                            ) : (
                                <FontAwesomeIcon icon={faArrowLeft} />
                            )
                        }
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
            </div>
        </StyledSider>
    );
};
