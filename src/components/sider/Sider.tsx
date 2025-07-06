import React from "react";
import {StyledSider} from "./Sider.style.tsx";
import {Menu, type MenuProps} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar, faSquarePlus} from "@fortawesome/free-regular-svg-icons";

export const Sider = () => {

    type MenuItem = Required<MenuProps>['items'][number];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('Nouveau match', 'newMatch', <FontAwesomeIcon icon={faSquarePlus} />),
        getItem('Statistiques', 'stats', <FontAwesomeIcon icon={faChartBar} />),
    ];

    return (
        <StyledSider
            collapsible
            defaultCollapsed
        >
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </StyledSider>
    )
}