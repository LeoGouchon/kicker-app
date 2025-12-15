import { Empty, theme } from 'antd';
import type { ChartOptions, ScriptableContext } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { MATCH_PER_SEASON_MIN_NUMBER } from '../../../../constants.tsx';
import { getBackgroundColor, getBorderColor, GLOBAL_CHART_DATASETS_OPTIONS } from '../../../../utils/chart.ts';

export type EloHistory = {
    date: string;
    elo: number;
};

export type SeasonalStats = {
    year: number;
    quarter: number;
    rank: number;
    wins: number;
    losses: number;
    eloHistory: EloHistory[];
};

export type AllTimeStats = {
    wins: number;
    losses: number;
    rank: number;
    eloHistory: EloHistory[];
};

const getCurrentYearAndQuarter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return { year, quarter: quarter };
};

const getSeasonProgress = () => {
    const now = new Date();
    const startMonth = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), startMonth, 1);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 3);
    return Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())));
};

const normalizeEloToPercent = (eloHistory: EloHistory[], seasonProgress = 1) => {
    const n = eloHistory.length;
    if (n === 0) return { x: [], y: [] };
    if (n === 1) return { x: [0], y: [eloHistory[0].elo] };

    const sliced = eloHistory;
    const x = sliced.map((_, i) => (i / (n - 1)) * 100 * seasonProgress);
    const y = sliced.map((e) => e.elo);

    return { x, y };
};

export const SeasonedElo = React.memo(
    ({ data: seasonalStats, chartOptions }: { data: SeasonalStats[]; chartOptions: ChartOptions<'line'> }) => {
        const { token } = theme.useToken();
        const axisTitle = token.colorText;

        const labels = Array.from({ length: 100 }, (_, i) => `${i + 1}%`);
        const { year: currentYear, quarter: currentQuarter } = getCurrentYearAndQuarter();

        const seasonalData = {
            labels,
            datasets: seasonalStats
                .filter((s) => s.eloHistory.length >= MATCH_PER_SEASON_MIN_NUMBER)
                .map((season: SeasonalStats, idx) => {
                    const isCurrent = season.year === currentYear && season.quarter === currentQuarter;
                    const { x, y } = normalizeEloToPercent(season.eloHistory, isCurrent ? getSeasonProgress() : 1);
                    return {
                        label: `${season.year} - ${season.quarter}`,
                        data: x.map((percent, i) => ({ x: percent, y: y[i] })),
                        borderColor: getBorderColor(idx),
                        backgroundColor: (context: ScriptableContext<'line'>) => getBackgroundColor(context, idx),
                        ...GLOBAL_CHART_DATASETS_OPTIONS,
                    };
                }),
        };

        const options = {
            ...chartOptions,
            scales: {
                ...chartOptions?.scales,
                x: {
                    ...chartOptions?.scales?.x,
                    type: 'linear' as const,
                    title: { display: true, text: '% de saison', color: axisTitle },
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: (value: number | string) => `${value}%`,
                    },
                },
            },
        };

        return (
            <>
                {seasonalData.datasets.length === 0 ? (
                    <Empty
                        style={{ marginTop: 24 }}
                        description={`Aucune saison avec les ${MATCH_PER_SEASON_MIN_NUMBER} matchs nécessaires pour être classé.`}
                    />
                ) : (
                    <div style={{ height: 320 }}>
                        <Line data={seasonalData} options={options} />
                    </div>
                )}
            </>
        );
    }
);

SeasonedElo.displayName = 'SeasonedElo';
