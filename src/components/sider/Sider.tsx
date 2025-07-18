import React, {useState} from "react";
import {StyledSider} from "./Sider.style.tsx";
import {Button, Menu, type MenuProps} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

export const Sider = () => {

    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);
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
        getItem('Nouveau match', ROUTES.NEW_MATCH, <FontAwesomeIcon
            icon={faSquarePlus}/>, () => navigate(ROUTES.NEW_MATCH)),
        getItem('Statistiques', ROUTES.DASHBOARD, <FontAwesomeIcon
            icon={faChartBar}/>, () => navigate(ROUTES.DASHBOARD)),
    ];

    return (
        <StyledSider
            collapsible
            defaultCollapsed
            collapsedWidth={60}
            trigger={null}
            collapsed={isCollapsed}
        >
            <div style={{height: '100%', paddingBottom: '32px'}}>
                <div style={{height: '100%'}}>
                    <Menu selectedKeys={[location.pathname]} theme="dark" mode="inline" items={items}/>
                </div>
                <div style={{height: "fit-content"}}>
                    <Button
                        block
                        type="primary"
                        icon={isCollapsed
                            ? <FontAwesomeIcon icon={faArrowRight}/>
                            : <FontAwesomeIcon icon={faArrowLeft}/>}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
            </div>
        </StyledSider>
    )
}