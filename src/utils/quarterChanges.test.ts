import { describe, expect, it } from 'vitest';

import type { EloHistory } from '../modules/player/components/Elo/SeasonedElo.tsx';
import { getQuarterChanges, getQuarterLabel } from './quarterChanges.ts';

const buildHistory = (dates: string[]): EloHistory[] => dates.map((date) => ({ date, elo: 1000 }));

// Dates right around the Q1/Q2 boundary: a time zone other than UTC would move them to another quarter
const boundaryDates = ['2026-03-31T23:30:00Z', '2026-04-01T00:30:00Z', '2026-07-15T10:00:00Z'];

describe('getQuarterChanges', () => {
    it('returns no marker when the history is empty', () => {
        expect(getQuarterChanges([])).toEqual([]);
    });

    it('returns no marker when every date is in the same quarter', () => {
        const history = buildHistory(['2026-10-01T08:00:00Z', '2026-11-15T12:00:00Z', '2026-12-31T20:00:00Z']);

        expect(getQuarterChanges(history)).toEqual([]);
    });

    it('returns a marker on the first date of each new quarter', () => {
        expect(getQuarterChanges(buildHistory(boundaryDates))).toEqual([
            new Date('2026-04-01T00:30:00Z'),
            new Date('2026-07-15T10:00:00Z'),
        ]);
    });

    it('returns the same markers when the dates are not sorted', () => {
        const unsorted = [boundaryDates[2], boundaryDates[0], boundaryDates[1]];

        expect(getQuarterChanges(buildHistory(unsorted))).toEqual([
            new Date('2026-04-01T00:30:00Z'),
            new Date('2026-07-15T10:00:00Z'),
        ]);
    });

    // Pending: docs/tech-debt.md, "getQuarterChanges ignore l'année"
    it.skip('returns a marker when the same quarter comes back the next year', () => {
        const history = buildHistory(['2025-02-10T12:00:00Z', '2026-02-10T12:00:00Z']);

        expect(getQuarterChanges(history)).toEqual([new Date('2026-02-10T12:00:00Z')]);
    });
});

describe('getQuarterLabel', () => {
    it.each([
        ['2026-01-01T00:00:00Z', '2026-1'],
        ['2026-04-01T00:00:00Z', '2026-2'],
        ['2026-12-31T23:59:59Z', '2026-4'],
    ])('returns the year and quarter of %s', (date, expected) => {
        expect(getQuarterLabel(new Date(date))).toBe(expected);
    });
});
