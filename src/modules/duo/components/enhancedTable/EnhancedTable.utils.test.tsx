import { describe, expect, it } from 'vitest';

import type { TableData } from '../../types/TableData.type.ts';
import type { MetricConfig } from './EnhancedTable.types.ts';
import {
    getStoredFilters,
    getTopBottomByMetric,
    metrics,
    renderMetricValue,
    storeFilters,
} from './EnhancedTable.utils.tsx';

const STORAGE_KEY = 'kicker.duo.enhancedTable.filters';

const buildRow = (value: number): TableData => ({
    key: `row-${value}`,
    player1: { id: `p1-${value}`, firstname: 'Ada', lastname: 'Lovelace' },
    player2: { id: `p2-${value}`, firstname: 'Alan', lastname: 'Turing' },
    matches: { rank: 1, value },
    winRate: { rank: 1, value },
    eloGainAvg: { rank: 1, value },
    eloGainTotal: { rank: 1, value },
    biggestAdvantage: { rank: 1, value },
    biggestWin: { rank: 1, value },
    performanceVsExpected: { rank: 1, value },
});

const getMetric = (key: MetricConfig['key']): MetricConfig => {
    const metric = metrics.find((candidate) => candidate.key === key);
    if (!metric) throw new Error(`Unknown metric ${key}`);
    return metric;
};

describe('storeFilters and getStoredFilters', () => {
    it('stores the filters as JSON and reads them back', () => {
        const filters = { playerIdFilter: 'p2', visibleMetricKeys: ['matches' as const] };

        storeFilters(filters);

        expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(filters));
        expect(getStoredFilters()).toStrictEqual(filters);
    });

    // Runs after a test that writes, to prove storage is cleared between tests
    it('returns no filter when nothing is stored', () => {
        expect(getStoredFilters()).toStrictEqual({});
    });

    it.each(['{oops', '42', 'null'])('returns no filter when the stored value is %s', (storedValue) => {
        localStorage.setItem(STORAGE_KEY, storedValue);

        expect(getStoredFilters()).toStrictEqual({});
    });

    it('ignores unknown metric keys', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ playerIdFilter: 'p1', visibleMetricKeys: ['winRate', 'unknown'] })
        );

        expect(getStoredFilters()).toStrictEqual({ playerIdFilter: 'p1', visibleMetricKeys: ['winRate'] });
    });

    it('drops fields that have an invalid value', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ visibleMetricKeys: ['unknown'], playerIdFilter: 3 }));

        expect(getStoredFilters()).toStrictEqual({ playerIdFilter: undefined, visibleMetricKeys: undefined });
    });
});

describe('getTopBottomByMetric', () => {
    it('returns no boundary when there are fewer than 5 rows', () => {
        const boundaries = getTopBottomByMetric([10, 20, 30, 40].map(buildRow));

        metrics.forEach((metric) => {
            expect(boundaries[metric.key]).toStrictEqual({ top: undefined, bottom: undefined });
        });
    });

    it('returns the 5th best and 5th worst values for each metric', () => {
        const boundaries = getTopBottomByMetric([40, 10, 60, 30, 50, 20].map(buildRow));

        metrics.forEach((metric) => {
            expect(boundaries[metric.key]).toStrictEqual({ top: 20, bottom: 50 });
        });
    });
});

describe('renderMetricValue', () => {
    it('adds a percent sign to a percentage metric', () => {
        expect(renderMetricValue(buildRow(55), getMetric('winRate'))).toBe('55%');
    });

    it('returns the raw value of another metric', () => {
        expect(renderMetricValue(buildRow(12), getMetric('matches'))).toBe(12);
    });
});
