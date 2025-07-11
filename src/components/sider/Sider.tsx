import React from "react";
import {StyledSider} from "./Sider.style.tsx";
import {Menu, type MenuProps} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";

export const Sider = () => {

    const navigate = useNavigate();
    type MenuItem = Required<MenuProps>['items'][number];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        onClick?: () => void,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            onClick,
            label,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('Nouveau match', 'newMatch', <FontAwesomeIcon icon={faSquarePlus} />, () => navigate(ROUTES.NEW_MATCH)),
        getItem('Statistiques', 'stats', <FontAwesomeIcon icon={faChartBar} />, () => navigate(ROUTES.DASHBOARD)),
    ];

    return (
        <StyledSider
            collapsible
            defaultCollapsed
            collapsedWidth={60}
        >
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </StyledSider>
    )
}