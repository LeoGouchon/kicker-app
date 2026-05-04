import type { TableData } from '../../types/TableData.type';

export type MetricKey = keyof Pick<
    TableData,
    'matches' | 'winRate' | 'eloGainAvg' | 'eloGainTotal' | 'biggestAdvantage' | 'biggestWin' | 'performanceVsExpected'
>;

export type MetricConfig = {
    key: MetricKey;
    title: string;
    description: string;
    isPercentage?: boolean;
};

export type TopBottomBoundary = {
    top?: number;
    bottom?: number;
};

export type StoredFilters = {
    playerIdFilter?: string;
    visibleMetricKeys?: MetricKey[];
};
