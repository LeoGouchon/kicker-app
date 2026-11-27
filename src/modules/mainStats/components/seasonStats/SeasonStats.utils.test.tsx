import { describe, expect, it } from 'vitest';

import { compareNullableNumbers, getRankEvolution, getUnrankedTag } from './SeasonStats.utils.tsx';

describe('getRankEvolution', () => {
    it.each<[string, number, number | null, number | null, number | 'new' | null]>([
        ['the player climbed', 3, 5, 1600, 2],
        ['the rank did not change', 3, 3, 1600, 0],
        ['the player dropped', 3, 1, 1600, -2],
        ['the player just reached the ranking', 4, null, null, 'new'],
        ['the player is back from inactivity', 4, null, 1580, null],
    ])('returns the expected value when %s', (_, rank, rankLastWeek, eloLastWeek, expected) => {
        expect(getRankEvolution({ rank, rankLastWeek, eloLastWeek })).toBe(expected);
    });
});

describe('getUnrankedTag', () => {
    it.each<[string, number | null, 'new' | 'inactive']>([
        ['the player has no elo', null, 'new'],
        ['the player has an elo', 1620, 'inactive'],
    ])('returns the expected tag when %s', (_, currentElo, expected) => {
        expect(getUnrankedTag({ currentElo })).toBe(expected);
    });
});

describe('compareNullableNumbers', () => {
    it.each<[string, number | null, number | null, number]>([
        ['a is smaller', 1, 2, -1],
        ['a is greater', 2, 1, 1],
        ['only a is null', null, 5, -1],
        ['only b is null', 5, null, 1],
        ['both are null', null, null, 0],
    ])('returns the expected sign when %s', (_, a, b, expectedSign) => {
        expect(Math.sign(compareNullableNumbers(a, b))).toBe(expectedSign);
    });
});
