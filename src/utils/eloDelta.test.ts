import { describe, expect, it } from 'vitest';

import { getEloDelta } from './eloDelta.ts';

describe('getEloDelta', () => {
    it.each<[string, number | null, number | null, number | null]>([
        ['the player gained points', 1620, 1600, 20],
        ['the player lost points', 1580, 1600, -20],
        ['the elo did not change', 1600, 1600, 0],
        ['the last-week elo is missing', 1620, null, null],
        ['the current elo is missing', null, 1600, null],
    ])('returns the expected value when %s', (_, currentElo, eloLastWeek, expected) => {
        expect(getEloDelta({ currentElo, eloLastWeek })).toBe(expected);
    });
});
