import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton, Tag, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

import { LinkPlayer } from '../../../components/linkPlayer/LinkPlayer.tsx';
import { useGetGlobalStats } from '../../../hooks/useApiEndPoint/useStats.ts';
import type { GlobalStats } from '../../../types/GlobalStats.type.ts';
import type { Player } from '../../../types/Player.type.ts';
import {
    CardContent,
    HoverableDashboardCard,
    RankingDeltaText,
    RankingSummaryList,
    RankingSummaryRow,
    RankingSummarySections,
} from '../Dashboard.style.tsx';

const getCurrentSeason = () => {
    const now = new Date();
    return {
        year: now.getFullYear(),
        quarter: Math.floor(now.getMonth() / 3) + 1,
    };
};

const getTopRankedPlayers = (players?: GlobalStats[]) =>
    players
        ?.slice()
        ?.filter((player) => player.rank > 0)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5) ?? [];

const toPlayer = (player: GlobalStats): Player => ({
    id: player.playerId,
    firstname: player.firstname,
    lastname: player.lastname,
});

const RankingDelta = ({ player }: { player: GlobalStats }) => {
    const delta = player.currentElo - player.eloLastWeek;

    if (delta === 0) {
        return <Typography.Text type="secondary">= 0</Typography.Text>;
    }

    return delta > 0 ? (
        <RankingDeltaText delta="up">
            <FontAwesomeIcon icon={faCaretUp} /> {delta}
        </RankingDeltaText>
    ) : (
        <RankingDeltaText delta="down">
            <FontAwesomeIcon icon={faCaretDown} /> {delta * -1}
        </RankingDeltaText>
    );
};

const renderRankingPlayer = (rankingPlayer: GlobalStats) => (
    <RankingSummaryRow key={rankingPlayer.playerId}>
        <Typography.Text strong>#{rankingPlayer.rank}</Typography.Text>
        <LinkPlayer player={toPlayer(rankingPlayer)} />
        <Tag>{rankingPlayer.currentElo}</Tag>
        <RankingDelta player={rankingPlayer} />
    </RankingSummaryRow>
);

const renderRankingSummaryContent = (isLoading: boolean, players: GlobalStats[]) => {
    const hasPlayers = players.length > 0;

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 5 }} title={false} />;
    }

    if (!hasPlayers) {
        return <Typography.Text type="secondary">Aucun joueur classé</Typography.Text>;
    }

    return players.map(renderRankingPlayer);
};

const RankingSummary = ({
    isLoading,
    players,
    title,
}: {
    isLoading: boolean;
    players: GlobalStats[];
    title: string;
}) => (
    <RankingSummaryList>
        <Typography.Text strong>{title}</Typography.Text>
        {renderRankingSummaryContent(isLoading, players)}
    </RankingSummaryList>
);

export const RankingSummaryCard = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const currentSeason = getCurrentSeason();
    const { isLoading: isSeasonRankingLoading, data: seasonRanking } = useGetGlobalStats(currentSeason);
    const { isLoading: isOverallRankingLoading, data: overallRanking } = useGetGlobalStats();

    return (
        <HoverableDashboardCard key={'ranking-summary'} flex={2} type={'secondary'}>
            <CardContent vertical gap="middle">
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Classement
                </Typography.Title>
                <RankingSummarySections vertical={isMobile}>
                    <RankingSummary
                        isLoading={isSeasonRankingLoading}
                        players={getTopRankedPlayers(seasonRanking)}
                        title={`Saison ${currentSeason.year} T${currentSeason.quarter}`}
                    />
                    <RankingSummary
                        isLoading={isOverallRankingLoading}
                        players={getTopRankedPlayers(overallRanking)}
                        title="General"
                    />
                </RankingSummarySections>
            </CardContent>
        </HoverableDashboardCard>
    );
};
