import React, {useContext, useState} from "react";
import {StyledSider} from "./Sider.style.tsx";
import {Button, Menu, type MenuProps} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";
import {faArrowLeft, faArrowRight, faMedal, faTableList} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../../context/UserContext.tsx";

export const Sider = () => {

    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);
    type MenuItem = Required<MenuProps>['items'][number];
    const {user} = useContext(UserContext);

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        onClick?: () => void,
        disabled?: boolean,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            onClick,
            label,
            disabled
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('Nouveau match', ROUTES.NEW_MATCH, <FontAwesomeIcon
            icon={faSquarePlus}/>, () => navigate(ROUTES.NEW_MATCH), !user),
        getItem('Historique', ROUTES.HISTORY, <FontAwesomeIcon
            icon={faTableList}/>, () => navigate(ROUTES.HISTORY), false),
        getItem('Classement', ROUTES.RANKING, <FontAwesomeIcon
            icon={faMedal}/>, () => navigate(ROUTES.RANKING), !user?.admin),
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