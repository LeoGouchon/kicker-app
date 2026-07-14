import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { FlexFullWidth } from '../../App.style.tsx';
import { UserContext } from '../../context/UserContext.tsx';
import { type Route, ROUTES } from '../../routes/constant.ts';
import { HistorySummaryCard } from './components/HistorySummaryCard.tsx';
import { RankingSummaryCard } from './components/RankingSummaryCard.tsx';
import { CardContent, HoverableDashboardCard, IconWrapper } from './Dashboard.style.tsx';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const handleCardClick = (route: Route) => {
        navigate(route === ROUTES.NEW_MATCH && !user ? ROUTES.PUBLIC_NEW_MATCH : route);
    };

    return (
        <FlexFullWidth vertical gap="large">
            <Typography.Title level={3}>
                {user ? `Bonjour ${user.player?.firstname}` : 'Tableau de bord'}
            </Typography.Title>
            <FlexFullWidth vertical gap={'medium'}>
                <FlexFullWidth gap={'medium'} vertical={isMobile} wrap={!isMobile}>
                    <HoverableDashboardCard
                        key={'new-match'}
                        onClick={() => handleCardClick(ROUTES.NEW_MATCH)}
                        flex={2}
                        type={'superior'}
                    >
                        <CardContent gap="middle" align={'baseline'}>
                            <Flex justify="space-between" align="flex-start" gap="small">
                                <IconWrapper align="center" justify="center">
                                    <FontAwesomeIcon icon={faSquarePlus} />
                                </IconWrapper>
                            </Flex>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Enregistrer un nouveau match
                            </Typography.Title>
                        </CardContent>
                    </HoverableDashboardCard>
                    <HoverableDashboardCard
                        key={'mathematics'}
                        onClick={() => handleCardClick(ROUTES.STATS_HELPER)}
                        flex={1}
                        type={'secondary'}
                    >
                        <CardContent
                            align={'baseline'}
                            gap={isMobile ? undefined : 'middle'}
                            style={{
                                minHeight: 'unset',
                            }}
                        >
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Comprendre les points
                            </Typography.Title>
                        </CardContent>
                    </HoverableDashboardCard>
                </FlexFullWidth>
                <FlexFullWidth gap={'medium'} vertical={isMobile} wrap={!isMobile}>
                    <RankingSummaryCard />
                    <HistorySummaryCard />
                </FlexFullWidth>
            </FlexFullWidth>
        </FlexFullWidth>
    );
};
