import { Empty, Skeleton, Typography } from 'antd';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { MatchLine } from '../../../components/matchLine/MatchLine.tsx';
import { useGetMatches } from '../../../hooks/useApiEndPoint/useMatch.ts';
import { ROUTES } from '../../../routes/constant.ts';
import {
    CardContent,
    HistorySummaryList,
    HistorySummaryMatchLine,
    HoverableDashboardCard,
} from '../Dashboard.style.tsx';

export const HistorySummaryCard = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetMatches({
        page: 0,
        size: 3,
        dateOrder: 'descend',
    });

    const matches = data?.content ?? [];

    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target instanceof Element && event.target.closest('a')) {
            return;
        }

        navigate(ROUTES.HISTORY);
    };

    let content;
    if (isLoading) {
        content = <Skeleton active paragraph={{ rows: 3 }} title={false} />;
    }

    if (matches.length > 0) {
        content = (
            <HistorySummaryList vertical>
                {matches.map((match) => (
                    <HistorySummaryMatchLine key={match.id}>
                        <MatchLine match={match} isSmall />
                    </HistorySummaryMatchLine>
                ))}
            </HistorySummaryList>
        );
    }

    if (!isLoading && matches.length === 0) {
        content = <Empty description={"Aucun match dans l'historique"} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
        <HoverableDashboardCard type={'secondary'} key={'history-summary'} onClick={handleCardClick} flex={1}>
            <CardContent vertical justify="space-between" gap="middle">
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Historique
                </Typography.Title>
                {content}
            </CardContent>
        </HoverableDashboardCard>
    );
};
