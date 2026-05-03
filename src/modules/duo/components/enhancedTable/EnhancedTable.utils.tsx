import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';

import type { TableData } from '../../types/TableData.type';
import { RankTag, type RankTone } from './EnhancedTable.style.tsx';
import type { MetricConfig, MetricKey, StoredFilters, TopBottomBoundary } from './EnhancedTable.types.ts';

const STORAGE_KEY = 'kicker.duo.enhancedTable.filters';

const podiumTagTones: Record<number, RankTone> = {
    1: 'gold',
    2: 'silver',
    3: 'bronze',
};

export const metrics: MetricConfig[] = [
    {
        key: 'matches',
        title: 'Nombre matchs',
        description: 'Nombre de matchs joués.',
    },
    {
        key: 'winRate',
        title: 'Pourcentage victoire',
        description: '%Victoire = victoire / match.',
        isPercentage: true,
    },
    {
        key: 'eloGainAvg',
        title: 'Moyenne ELO gagné',
        description: "Nombre d'ELO moyen gagné par match au classement général.",
    },
    {
        key: 'eloGainTotal',
        title: 'Total ELO gagne',
        description: "Total des points ELO gagnés au classement général sur l'ensemble des matchs.",
    },
    {
        key: 'biggestAdvantage',
        title: 'Facilité adversaire',
        description: "Delta ELO moyen entre le duo et l'adversaire. > 0 = plus facile, < 0 = plus difficile.",
    },
    {
        key: 'biggestWin',
        title: 'Meilleure victoire',
        description: "Victoire ayant offert le plus d'ELO au classement général.",
    },
    {
        key: 'performanceVsExpected',
        title: 'Performance vs Attendue',
        description:
            'Performance relative par rapport au niveau adverse. > 0 = performance supérieure aux attentes, < 0 = performance inferieure aux attentes.',
    },
];

export const getDefaultVisibleMetricKeys = () => metrics.map((metric) => metric.key);

const isMetricKey = (value: unknown): value is MetricKey => {
    return typeof value === 'string' && metrics.some((metric) => metric.key === value);
};

export const getStoredFilters = (): StoredFilters => {
    if (typeof globalThis === 'undefined') {
        return {};
    }

    const storedFilters = globalThis.localStorage.getItem(STORAGE_KEY);

    if (!storedFilters) {
        return {};
    }

    try {
        const parsedFilters: unknown = JSON.parse(storedFilters);

        if (!parsedFilters || typeof parsedFilters !== 'object') {
            return {};
        }

        const filters = parsedFilters as Record<string, unknown>;
        const visibleMetricKeys = Array.isArray(filters.visibleMetricKeys)
            ? filters.visibleMetricKeys.filter(isMetricKey)
            : undefined;

        return {
            playerIdFilter: typeof filters.playerIdFilter === 'string' ? filters.playerIdFilter : undefined,
            visibleMetricKeys: visibleMetricKeys?.length ? visibleMetricKeys : undefined,
        };
    } catch {
        return {};
    }
};

export const storeFilters = (filters: StoredFilters) => {
    if (typeof globalThis === 'undefined') {
        return;
    }

    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
};

const getBoundaryValue = (values: number[], index: number): number | undefined => {
    return values.length > index ? values[index] : undefined;
};

export const getTopBottomByMetric = (data: TableData[]): Record<MetricKey, TopBottomBoundary> =>
    metrics.reduce(
        (boundaries, metric) => {
            const sortedDescValues = data.map((record) => record[metric.key].value).sort((a, b) => b - a);

            boundaries[metric.key] = {
                top: getBoundaryValue(sortedDescValues, 4),
                bottom: getBoundaryValue([...sortedDescValues].reverse(), 4),
            };

            return boundaries;
        },
        {} as Record<MetricKey, TopBottomBoundary>
    );

export const getRankSorter = (metric: MetricConfig) => {
    return (a: TableData, b: TableData) => a[metric.key].rank - b[metric.key].rank;
};

const formatFrenchOrdinalRank = (rank: number) => {
    return rank === 1 ? '1er' : `${rank}e`;
};

export const renderRank = (
    record: TableData,
    metric: MetricConfig,
    topBottomByMetric: Record<MetricKey, TopBottomBoundary>
) => {
    const { top, bottom } = topBottomByMetric[metric.key];
    const metricValue = record[metric.key].value;
    const rank = record[metric.key].rank;
    const formattedRank = formatFrenchOrdinalRank(rank);
    const podiumTone = podiumTagTones[rank];

    if (podiumTone) {
        return (
            <RankTag bordered={false} rankTone={podiumTone}>
                {formattedRank}
            </RankTag>
        );
    }

    if (top !== undefined && metricValue >= top) {
        return (
            <RankTag bordered={false} rankTone="top">
                {formattedRank}
            </RankTag>
        );
    }

    if (bottom !== undefined && metricValue <= bottom) {
        return (
            <RankTag bordered={false} rankTone="bottom">
                {formattedRank}
            </RankTag>
        );
    }

    return formattedRank;
};

export const renderMetricValue = (record: TableData, metric: MetricConfig) => {
    const value = record[metric.key].value;

    return metric.isPercentage ? `${value}%` : value;
};

export const renderMetricTitle = (metric: MetricConfig) => (
    <Tooltip title={metric.description}>
        <>
            {metric.title} <FontAwesomeIcon icon={faInfoCircle} />
        </>
    </Tooltip>
);
