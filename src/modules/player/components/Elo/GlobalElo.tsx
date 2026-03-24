import { Empty, theme } from 'antd';
import type { ChartOptions, ScriptableContext } from 'chart.js';
import type { AnnotationOptions } from 'chartjs-plugin-annotation';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { MATCH_PER_SEASON_MIN_NUMBER } from '../../../../constants.tsx';
import {
    getBackgroundColor,
    getBorderColor,
    getEloAnchorAnnotation,
    getEloAxisRange,
    GLOBAL_CHART_DATASETS_OPTIONS,
    roundTickToStep,
} from '../../../../utils/chart.ts';
import { getQuarterChanges, getQuarterLabel } from '../../../../utils/quarterChanges.ts';
import type { AllTimeStats, EloHistory } from './SeasonedElo.tsx';

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
        const { token } = theme.useToken();

        const pointsHistoryOverTime = getOverallData(data.eloHistory);
        const anchorElo = 1500;
        const axisRange = getEloAxisRange({
            values: pointsHistoryOverTime.map((point) => point.y),
            targetRange: 500,
            anchorElo,
        });

        const quarterMarkers = getQuarterChanges(data.eloHistory);

        const annotations = quarterMarkers.reduce(
            (acc, quarter, currentIndex) => {
                acc[`quarter${currentIndex}`] = {
                    type: 'line' as const,
                    xMin: new Intl.DateTimeFormat('fr-FR').format(quarter),
                    xMax: new Intl.DateTimeFormat('fr-FR').format(quarter),
                    borderDash: [5, 5],
                    borderColor: token.colorBorder,
                    label: {
                        display: true,
                        content: getQuarterLabel(new Date(quarter)),
                        position: 'end',
                        backgroundColor: token.colorBorder,
                    },
                };
                return acc;
            },
            {} as Record<string, AnnotationOptions>
        );

        annotations.anchor1500 = getEloAnchorAnnotation({
            anchorElo,
            color: token.colorBorderSecondary,
        });

        const chartData = {
            datasets: [
                {
                    label: 'Général',
                    dataLabels: data.eloHistory.map((item: EloHistory) =>
                        new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
                            new Date(item.date)
                        )
                    ),
                    data: pointsHistoryOverTime,
                    borderColor: getBorderColor(1),
                    backgroundColor: (context: ScriptableContext<'line'>) => getBackgroundColor(context, 1),
                    ...GLOBAL_CHART_DATASETS_OPTIONS,
                },
            ],
        };

        const options = {
            ...chartOptions,
            scales: {
                ...chartOptions?.scales,
                y: {
                    ...chartOptions?.scales?.y,
                    ticks: {
                        ...chartOptions?.scales?.y?.ticks,
                        callback: (value: number | string) => roundTickToStep({ value, step: 10 }),
                    },
                    ...(axisRange ? { min: axisRange.min, max: axisRange.max } : {}),
                },
            },
            plugins: {
                ...chartOptions.plugins,
                annotation: {
                    annotations: annotations,
                },
            },
        };

        return (
            <>
                {data.eloHistory.length < MATCH_PER_SEASON_MIN_NUMBER ? (
                    <Empty
                        style={{ marginTop: 24 }}
                        description={`Nombre de matchs necessaires pour calculer l'Élo : ${MATCH_PER_SEASON_MIN_NUMBER}`}
                    />
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
