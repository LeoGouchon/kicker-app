import { Card, Segmented, theme } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useState } from 'react';

import { GlobalElo } from './Elo/GlobalElo.tsx';
import { type AllTimeStats, type SeasonalStats, SeasonedElo } from './Elo/SeasonedElo.tsx';

const SEGMENTED_VALUE = {
    overall: { label: 'Général', value: 'overall' },
    season: { label: 'Saisons', value: 'season' },
};

export const EloEvolution = ({
    seasonalStats,
    allTimeStats,
}: {
    seasonalStats: SeasonalStats[];
    allTimeStats: AllTimeStats;
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [segmentedValue, setSegmentedValue] = useState(SEGMENTED_VALUE['overall'].value);

    const { token } = theme.useToken();

    const legendColor = token.colorTextSecondary;
    const axisText = token.colorTextSecondary;
    const gridColor = token.colorBorderSecondary;

    const globalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: legendColor },
            },
            title: { display: false },
        },
        scales: {
            x: {
                ticks: { color: axisText },
                grid: { color: gridColor },
            },
            y: {
                ticks: { color: axisText },
                grid: { color: gridColor },
            },
        },
    };

    return (
        <Card size={isMobile ? 'small' : 'default'}>
            <Segmented
                options={Object.values(SEGMENTED_VALUE)}
                value={segmentedValue}
                onChange={setSegmentedValue}
                block
                size={isMobile ? 'small' : 'middle'}
            />
            {segmentedValue === SEGMENTED_VALUE['season'].value && (
                <EloEvolution.Seasons data={seasonalStats} chartOptions={globalOptions} />
            )}
            {segmentedValue === SEGMENTED_VALUE['overall'].value && (
                <EloEvolution.Overall data={allTimeStats} chartOptions={globalOptions} />
            )}
        </Card>
    );
};

EloEvolution.Seasons = SeasonedElo;
EloEvolution.Overall = GlobalElo;
