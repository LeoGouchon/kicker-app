import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMedal, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { MenuProps } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../context/UserContext.tsx';
import { ROUTES } from '../routes/constant.ts';

export type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        onClick,
        label,
        disabled,
    } as MenuItem;
}

export const useGetMenuItemElements: () => MenuItem[] = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    return [
        getItem(
            'Nouveau match',
            ROUTES.NEW_MATCH,
            <FontAwesomeIcon icon={faSquarePlus} />,
            () => navigate(ROUTES.NEW_MATCH),
            !user
        ),
        getItem(
            'Historique',
            ROUTES.HISTORY,
            <FontAwesomeIcon icon={faTableList} />,
            () => navigate(ROUTES.HISTORY),
            false
        ),
        getItem(
            'Classement',
            ROUTES.RANKING,
            <FontAwesomeIcon icon={faMedal} />,
            () => navigate(ROUTES.RANKING),
            false
        ),
    ];
};
