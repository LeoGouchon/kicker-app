import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import {
    faCalculator,
    faHouse,
    faKey,
    faMedal,
    faTableList,
    faUserGroup,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { MenuProps } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../context/UserContext.tsx';
import { ROUTES } from '../routes/constant.ts';

export type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    children?: MenuItem[]
): MenuItem => ({
    key,
    icon,
    children,
    onClick,
    label,
    disabled,
});

const getDivider: () => MenuItem = () => {
    return {
        type: 'divider',
    };
};

export const useGetMenuItemElements: () => MenuItem[] = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    return [
        getItem('Accueil', ROUTES.HOME, <FontAwesomeIcon icon={faHouse} />, () => navigate(ROUTES.HOME), false),
        getDivider(),
        getItem(
            'Nouveau match',
            ROUTES.NEW_MATCH,
            <FontAwesomeIcon icon={faSquarePlus} />,
            () => navigate(user ? ROUTES.NEW_MATCH : ROUTES.PUBLIC_NEW_MATCH),
            false
        ),
        getItem(
            'Classement',
            ROUTES.RANKING,
            <FontAwesomeIcon icon={faMedal} />,
            () => navigate(ROUTES.RANKING),
            false
        ),
        getItem(
            'Historique',
            ROUTES.HISTORY,
            <FontAwesomeIcon icon={faTableList} />,
            () => navigate(ROUTES.HISTORY),
            false
        ),
        getItem('Duo', ROUTES.DUO, <FontAwesomeIcon icon={faUserGroup} />, () => navigate(ROUTES.DUO), false),
        getItem(
            'Mathématiques',
            ROUTES.STATS_HELPER,
            <FontAwesomeIcon icon={faCalculator} />,
            () => navigate(ROUTES.STATS_HELPER),
            false
        ),
        ...(user?.admin
            ? [
                  getDivider(),
                  getItem(
                      'Codes matchs',
                      ROUTES.KICKER_MATCH_CODES,
                      <FontAwesomeIcon icon={faKey} />,
                      () => navigate(ROUTES.KICKER_MATCH_CODES),
                      false
                  ),
                  getItem(
                      'Créer joueur',
                      ROUTES.CREATE_PLAYER,
                      <FontAwesomeIcon icon={faUserPlus} />,
                      () => navigate(ROUTES.CREATE_PLAYER),
                      false
                  ),
              ]
            : []),
    ];
};
