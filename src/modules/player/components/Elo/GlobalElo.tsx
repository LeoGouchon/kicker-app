import { Typography } from 'antd';
import type { ChartOptions, ScriptableContext } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { MATCH_PER_SEASON_MIN_NUMBER } from '../../../../constants.tsx';
import { getBackgroundColor, GLOBAL_CHART_DATASETS_OPTIONS } from '../../../../utils/chart.ts';
import type { AllTimeStats, EloHistory } from './SeasonedElo.tsx';

const { Text } = Typography;

const getOverallData = (eloHistory: EloHistory[]) => {
    const lastEloPerDay = new Map<string, number>();

    const sorted = [...eloHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const elo of sorted) {
        const day = new Intl.DateTimeFormat('fr-FR').format(new Date(elo.date));
        lastEloPerDay.set(day, elo.elo);
    }

    return Array.from(lastEloPerDay.entries()).map(([date, elo]) => ({
        x: date,
        y: elo,
    }));
};

export const GlobalElo = React.memo(
    ({ data, chartOptions }: { data: AllTimeStats; chartOptions: ChartOptions<'line'> }) => {
        const idx = 1;
        const hue = (idx * 30 - 140) % 360;

        const chartData = {
            datasets: [
                {
                    label: 'Général',
                    dataLabels: data.eloHistory.map((item: EloHistory) =>
                        new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
                            new Date(item.date)
                        )
                    ),
                    data: getOverallData(data.eloHistory),
                    borderColor: `hsla(${hue}, 70%, ${65 - idx * 5}%, ${1 - idx * 0.3})`,
                    backgroundColor: (context: ScriptableContext<'line'>) => getBackgroundColor(context, 1),
                    ...GLOBAL_CHART_DATASETS_OPTIONS,
                },
            ],
        };

        const options = {
            ...chartOptions,
        };

        return (
            <>
                {chartData.datasets[0].data.length < MATCH_PER_SEASON_MIN_NUMBER ? (
                    <Text type="secondary">
                        Nombre de matchs necessaires pour calculer l'Élo : {MATCH_PER_SEASON_MIN_NUMBER}
                    </Text>
                ) : (
                    <div style={{ height: 320 }}>
                        <Line data={chartData} options={options} />
                    </div>
                )}
            </>
        );
    }
);

GlobalElo.displayName = 'GlobalElo';
