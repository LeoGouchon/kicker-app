import { Breadcrumb, Divider } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { Link, matchPath, useLocation } from 'react-router-dom';

import { breadcrumbRoutes } from '../../routes';
import { ROUTES } from '../../routes/constant.ts';

const findCurrentBreadcrumb = (pathname: string) =>
    breadcrumbRoutes.find(({ path }) => matchPath({ path, end: true }, pathname));

export const AppBreadcrumb = () => {
    const { pathname } = useLocation();
    const currentBreadcrumb = findCurrentBreadcrumb(pathname);

    const currentLabel = currentBreadcrumb?.label ?? 'Page introuvable';
    const parentItems = currentBreadcrumb?.parents ?? [];

    const items: ItemType[] = [
        {
            title: pathname === ROUTES.HOME ? 'Accueil' : <Link to={ROUTES.HOME}>Accueil</Link>,
        },
        ...parentItems.map(({ label, path }) => ({
            title: path ? <Link to={path}>{label}</Link> : label,
        })),
    ];

    if (pathname !== ROUTES.HOME) {
        items.push({ title: currentLabel });
    }

    return (
        <>
            <Breadcrumb items={items} />
            <Divider size={'small'} style={{ width: 'calc(100% + 4px)', marginLeft: '-2px' }} />
        </>
    );
};
