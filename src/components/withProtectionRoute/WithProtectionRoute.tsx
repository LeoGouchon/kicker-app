import {Button, Result} from 'antd';
import {type JSX, useContext} from 'react';
import {useNavigate} from 'react-router-dom';

import {UserContext} from '../../context/UserContext.tsx';
import {ROUTES} from '../../routes/constant.ts';

export const WithProtectionRoute = ({isAdminRestricted = false, children}: { isAdminRestricted?: boolean, children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    const user = useContext(UserContext).user;

    const navigate = useNavigate();

    if (!token || !user || (isAdminRestricted && !user.admin)) {
        return <Result
            status="403"
            title="403"
            subTitle="Oops, vous n'êtes pas autorisé à accéder à cette page."
            extra={<Button type="primary" onClick={() => navigate(ROUTES.HOME)}>Retourner au menu</Button>}
        />;
    }

    return children;
};