import { Flex, Typography } from 'antd';

import { useGetDuoStats } from '../../hooks/useApiEndPoint/useStats.ts';
import { EnhancedTable } from './components/enhancedTable/EnhancedTable.tsx';
import type { RankedMetric, TableData } from './types/TableData.type.ts';

const { Title } = Typography;

export const DuoStatTables = () => {
    const { data: duoStats } = useGetDuoStats();

    const duoStatsWithKeys =
        duoStats?.map((duo) => ({
            key: `${duo.player1.id}-${duo.player2.id}`,
            duo,
        })) || [];

    const buildRankedMetrics = (metricValues: Array<{ key: string; value: number }>): Map<string, RankedMetric> =>
        metricValues
            .sort((a, b) => b.value - a.value)
            .reduce(
                (rankState, duo, index) => {
                    const rank = duo.value === rankState.previousValue ? rankState.previousRank : index + 1;

                    rankState.metrics.set(duo.key, {
                        rank,
                        value: duo.value,
                    });

                    return {
                        metrics: rankState.metrics,
                        previousRank: rank,
                        previousValue: duo.value,
                    };
                },
                {
                    metrics: new Map<string, RankedMetric>(),
                    previousRank: 0,
                    previousValue: undefined as number | undefined,
                }
            ).metrics;

    const matchesMetrics = buildRankedMetrics(
        duoStatsWithKeys.map(({ key, duo }) => ({
            key,
            value: duo.matches,
        }))
    );

    const winRateMetrics = buildRankedMetrics(
        duoStatsWithKeys.map(({ key, duo }) => ({
            key,
            value: Math.round((duo.wins / duo.matches) * 100),
        }))
    );

    const avgEloGainMetrics = buildRankedMetrics(
        duoStatsWithKeys.map(({ key, duo }) => ({
            key,
            value: duo.eloGainAvg,
        }))
    );

    const totalEloGainMetrics = buildRankedMetrics(
        duoStatsWithKeys.map(({ key, duo }) => ({
            key,
            value: duo.eloGainTotal,
        }))
    );

    const biggestAdvantageMetrics = buildRankedMetrics(
        duoStatsWithKeys.map(({ key, duo }) => ({
            key,
            value: (duo.player1EloAvg + duo.player2EloAvg) / 2 - duo.opponentEloAvg,
        }))
    );

    const getMetric = (metrics: Map<string, RankedMetric>, key: string): RankedMetric =>
        metrics.get(key) || {
            rank: 0,
            value: 0,
        };

    const tableData: TableData[] = duoStatsWithKeys
        .map(({ key, duo }) => {
            return {
                key,
                player1: duo.player1,
                player2: duo.player2,
                matches: getMetric(matchesMetrics, key),
                winRate: getMetric(winRateMetrics, key),
                eloGainAvg: getMetric(avgEloGainMetrics, key),
                eloGainTotal: getMetric(totalEloGainMetrics, key),
                biggestAdvantage: getMetric(biggestAdvantageMetrics, key),
            };
        })
        .sort((a, b) => a.winRate.rank - b.winRate.rank);

    return (
        <Flex vertical gap={'large'}>
            <Title level={2}>Stats</Title>
            <EnhancedTable data={tableData} />
        </Flex>
    );
};
