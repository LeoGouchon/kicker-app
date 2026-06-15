import { Empty, theme, TreeSelect } from 'antd';
import type { ChartOptions, ScriptableContext } from 'chart.js';
import { memo, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { MATCH_PER_SEASON_MIN_NUMBER } from '../../../../constants.tsx';
import {
    getBackgroundColor,
    getBorderColor,
    getEloAxisRange,
    getHue,
    GLOBAL_CHART_DATASETS_OPTIONS,
    roundTickToStep,
} from '../../../../utils/chart.ts';

export type EloHistory = {
    date: string;
    elo: number;
    max?: number;
    min?: number;
    firstQuartile?: number;
    thirdQuartile?: number;
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
    if (n === 0) return [];
    if (n === 1) return [{ x: 0, ...eloHistory[0] }];

    const sliced = eloHistory;
    const x = sliced.map((_, i) => (i / (n - 1)) * 100 * seasonProgress);

    return sliced.map((entry, i) => ({ x: x[i], ...entry }));
};

const hasDistributionValue = (
    points: EloHistory[],
    key: keyof Pick<EloHistory, 'min' | 'max' | 'firstQuartile' | 'thirdQuartile'>
) => points.some((point) => typeof point[key] === 'number');

type SeriesKind = 'min' | 'max' | 'quartile' | 'performance';

const SEASONED_ELO_SELECTED_SERIES_STORAGE_KEY = 'seasonedElo.selectedSeries';

const getSeasonKey = (season: SeasonalStats) => `${season.year}-${season.quarter}`;
const getSeriesValue = (season: SeasonalStats, kind: SeriesKind) => `${getSeasonKey(season)}:${kind}`;

const getAvailableSeriesValues = (season: SeasonalStats) => [
    getSeriesValue(season, 'performance'),
    ...(hasDistributionValue(season.eloHistory, 'min') ? [getSeriesValue(season, 'min')] : []),
    ...(hasDistributionValue(season.eloHistory, 'max') ? [getSeriesValue(season, 'max')] : []),
    ...(hasDistributionValue(season.eloHistory, 'firstQuartile') &&
    hasDistributionValue(season.eloHistory, 'thirdQuartile')
        ? [getSeriesValue(season, 'quartile')]
        : []),
];
const getSeasonMatchCount = (season: SeasonalStats) => season.wins + season.losses;

export const SeasonedElo = memo(
    ({ data: seasonalStats, chartOptions }: { data: SeasonalStats[]; chartOptions: ChartOptions<'line'> }) => {
        const { token } = theme.useToken();
        const axisTitle = token.colorText;
        const anchorElo = 1500;

        const labels = Array.from({ length: 100 }, (_, i) => `${i + 1}%`);
        const { year: currentYear, quarter: currentQuarter } = getCurrentYearAndQuarter();
        const eligibleSeasons = useMemo(
            () => seasonalStats.filter((s) => getSeasonMatchCount(s) >= MATCH_PER_SEASON_MIN_NUMBER),
            [seasonalStats]
        );
        const defaultSelectedSeries = useMemo(() => {
            const currentSeason = eligibleSeasons.find(
                (season) => season.year === currentYear && season.quarter === currentQuarter
            );
            const latestSeason =
                currentSeason ?? [...eligibleSeasons].sort((a, b) => b.year - a.year || b.quarter - a.quarter)[0];

            return latestSeason ? getAvailableSeriesValues(latestSeason) : [];
        }, [currentQuarter, currentYear, eligibleSeasons]);
        const availableSeriesValues = useMemo(
            () => new Set(eligibleSeasons.flatMap((season) => getAvailableSeriesValues(season))),
            [eligibleSeasons]
        );
        const [selectedSeries, setSelectedSeries] = useState<string[]>(() => {
            const storedSelectedSeries = sessionStorage.getItem(SEASONED_ELO_SELECTED_SERIES_STORAGE_KEY);
            if (!storedSelectedSeries) return defaultSelectedSeries;

            try {
                const parsed = JSON.parse(storedSelectedSeries);
                if (!Array.isArray(parsed)) return defaultSelectedSeries;

                const selectedAvailableSeries = parsed.filter(
                    (value): value is string => typeof value === 'string' && availableSeriesValues.has(value)
                );
                return selectedAvailableSeries;
            } catch {
                return defaultSelectedSeries;
            }
        });

        useEffect(() => {
            setSelectedSeries((currentSelectedSeries) => {
                return currentSelectedSeries.filter((value) => availableSeriesValues.has(value));
            });
        }, [availableSeriesValues]);

        useEffect(() => {
            sessionStorage.setItem(SEASONED_ELO_SELECTED_SERIES_STORAGE_KEY, JSON.stringify(selectedSeries));
        }, [selectedSeries]);

        const selectedSeriesSet = useMemo(() => new Set(selectedSeries), [selectedSeries]);
        const treeData = seasonalStats.map((season) => {
            const matchCount = getSeasonMatchCount(season);
            const isSeasonEligible = matchCount >= MATCH_PER_SEASON_MIN_NUMBER;
            const children = [
                {
                    title: 'Performance du joueur',
                    value: getSeriesValue(season, 'performance'),
                    disabled: !isSeasonEligible,
                },
                ...(hasDistributionValue(season.eloHistory, 'min')
                    ? [
                          {
                              title: 'Min',
                              value: getSeriesValue(season, 'min'),
                              disabled: !isSeasonEligible,
                          },
                      ]
                    : []),
                ...(hasDistributionValue(season.eloHistory, 'max')
                    ? [
                          {
                              title: 'Max',
                              value: getSeriesValue(season, 'max'),
                              disabled: !isSeasonEligible,
                          },
                      ]
                    : []),
                ...(hasDistributionValue(season.eloHistory, 'firstQuartile') &&
                hasDistributionValue(season.eloHistory, 'thirdQuartile')
                    ? [
                          {
                              title: 'Zone quartile',
                              value: getSeriesValue(season, 'quartile'),
                              disabled: !isSeasonEligible,
                          },
                      ]
                    : []),
            ];

            return {
                title: isSeasonEligible
                    ? `${season.year} - ${season.quarter}`
                    : `${season.year} - ${season.quarter} - pas assez de match (${matchCount}/${MATCH_PER_SEASON_MIN_NUMBER})`,
                value: getSeasonKey(season),
                disabled: !isSeasonEligible,
                selectable: false,
                children,
            };
        });
        const axisRange = getEloAxisRange({
            values: eligibleSeasons.flatMap((season) =>
                season.eloHistory.flatMap((entry) =>
                    [
                        selectedSeriesSet.has(getSeriesValue(season, 'performance')) ? entry.elo : undefined,
                        selectedSeriesSet.has(getSeriesValue(season, 'min')) ? entry.min : undefined,
                        selectedSeriesSet.has(getSeriesValue(season, 'max')) ? entry.max : undefined,
                        selectedSeriesSet.has(getSeriesValue(season, 'quartile')) ? entry.firstQuartile : undefined,
                        selectedSeriesSet.has(getSeriesValue(season, 'quartile')) ? entry.thirdQuartile : undefined,
                    ].filter((value): value is number => typeof value === 'number')
                )
            ),
            targetRange: 500,
            anchorElo,
        });

        const seasonalData = {
            labels,
            datasets: eligibleSeasons.flatMap((season: SeasonalStats, idx) => {
                const isCurrent = season.year === currentYear && season.quarter === currentQuarter;
                const points = normalizeEloToPercent(season.eloHistory, isCurrent ? getSeasonProgress() : 1);
                const seasonLabel = `${season.year} - ${season.quarter}`;
                const showPerformance = selectedSeriesSet.has(getSeriesValue(season, 'performance'));
                const showQuartileArea =
                    selectedSeriesSet.has(getSeriesValue(season, 'quartile')) &&
                    hasDistributionValue(season.eloHistory, 'firstQuartile') &&
                    hasDistributionValue(season.eloHistory, 'thirdQuartile');
                const showMinLine =
                    selectedSeriesSet.has(getSeriesValue(season, 'min')) &&
                    hasDistributionValue(season.eloHistory, 'min');
                const showMaxLine =
                    selectedSeriesSet.has(getSeriesValue(season, 'max')) &&
                    hasDistributionValue(season.eloHistory, 'max');

                return [
                    ...(showQuartileArea
                        ? [
                              {
                                  label: `${seasonLabel} - 1er quartile`,
                                  data: points.map((point) => ({
                                      x: point.x,
                                      y: point.firstQuartile ?? null,
                                  })),
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  pointRadius: 0,
                                  pointHoverRadius: 0,
                                  tension: 0.3,
                                  fill: false,
                              },
                              {
                                  label: `${seasonLabel} - top 25-75%`,
                                  data: points.map((point) => ({
                                      x: point.x,
                                      y: point.thirdQuartile ?? null,
                                  })),
                                  borderColor: 'transparent',
                                  backgroundColor: `hsla(${getHue(idx)}, 70%, 55%, 0.1)`,
                                  pointRadius: 0,
                                  pointHoverRadius: 0,
                                  tension: 0.3,
                                  fill: '-1',
                              },
                          ]
                        : []),
                    ...(showMinLine
                        ? [
                              {
                                  label: `${seasonLabel} - Minimum`,
                                  data: points.map((point) => ({
                                      x: point.x,
                                      y: point.min ?? null,
                                  })),
                                  borderColor: getBorderColor(idx),
                                  borderDash: [2, 5],
                                  borderWidth: 1,
                                  backgroundColor: 'transparent',
                                  pointRadius: 0,
                                  pointHoverRadius: 0,
                                  tension: 0.3,
                                  fill: false,
                              },
                          ]
                        : []),
                    ...(showMaxLine
                        ? [
                              {
                                  label: `${seasonLabel} - Maximum`,
                                  data: points.map((point) => ({
                                      x: point.x,
                                      y: point.max ?? null,
                                  })),
                                  borderColor: getBorderColor(idx),
                                  borderDash: [2, 5],
                                  borderWidth: 1,
                                  backgroundColor: 'transparent',
                                  pointRadius: 0,
                                  pointHoverRadius: 0,
                                  tension: 0.3,
                                  fill: false,
                              },
                          ]
                        : []),
                    ...(showPerformance
                        ? [
                              {
                                  label: seasonLabel,
                                  data: points.map((point) => ({ x: point.x, y: point.elo })),
                                  borderColor: getBorderColor(idx),
                                  backgroundColor: (context: ScriptableContext<'line'>) =>
                                      getBackgroundColor(context, idx),
                                  ...GLOBAL_CHART_DATASETS_OPTIONS,
                              },
                          ]
                        : []),
                ];
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
                legend: {
                    ...chartOptions.plugins?.legend,
                    display: false,
                },
            },
        } as ChartOptions<'line'>;

        return (
            <>
                {eligibleSeasons.length === 0 ? (
                    <Empty
                        style={{ marginTop: 24 }}
                        description={`Aucune saison avec les ${MATCH_PER_SEASON_MIN_NUMBER} matchs nécessaires pour être classé.`}
                    />
                ) : (
                    <>
                        <TreeSelect
                            allowClear
                            maxTagCount="responsive"
                            placeholder="Choisir les courbes"
                            showCheckedStrategy={TreeSelect.SHOW_CHILD}
                            style={{ width: '100%', marginBottom: 16 }}
                            treeCheckable
                            treeData={treeData}
                            value={selectedSeries}
                            onChange={(value: string[]) => setSelectedSeries(value ?? [])}
                        />
                        {seasonalData.datasets.length === 0 ? (
                            <Empty style={{ marginTop: 24 }} description="Aucune courbe selectionnée." />
                        ) : (
                            <div style={{ height: 320 }}>
                                <Line data={seasonalData} options={options} />
                            </div>
                        )}
                    </>
                )}
            </>
        );
    }
);

SeasonedElo.displayName = 'SeasonedElo';
