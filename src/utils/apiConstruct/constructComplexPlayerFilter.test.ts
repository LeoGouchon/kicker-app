import { describe, expect, it } from 'vitest';

import { constructComplexPlayerFilter } from './constructComplexPlayerFilter.ts';

describe('constructComplexPlayerFilter', () => {
    it('returns an empty string when there is no filter', () => {
        expect(constructComplexPlayerFilter(undefined)).toBe('');
    });

    it('returns only the operator when there is no player group', () => {
        expect(constructComplexPlayerFilter({ operator: 'AND', playerGroups: [] })).toBe('&filter.operator=AND');
    });

    it('indexes the players of a single group', () => {
        expect(
            constructComplexPlayerFilter({
                operator: 'AND',
                playerGroups: [{ operator: 'WITH', playerIds: ['p1', 'p2'] }],
            })
        ).toBe(
            '&filter.operator=AND' +
                '&filter.groups[0].operator=WITH' +
                '&filter.groups[0].playerIds[0]=p1' +
                '&filter.groups[0].playerIds[1]=p2'
        );
    });

    it('indexes each group and restarts player indexes at 0', () => {
        expect(
            constructComplexPlayerFilter({
                operator: 'OR',
                playerGroups: [
                    { operator: 'WITH', playerIds: ['p1', 'p2'] },
                    { operator: 'AGAINST', playerIds: ['p3'] },
                ],
            })
        ).toBe(
            '&filter.operator=OR' +
                '&filter.groups[0].operator=WITH' +
                '&filter.groups[0].playerIds[0]=p1' +
                '&filter.groups[0].playerIds[1]=p2' +
                '&filter.groups[1].operator=AGAINST' +
                '&filter.groups[1].playerIds[0]=p3'
        );
    });

    it('encodes player ids', () => {
        expect(
            constructComplexPlayerFilter({
                operator: 'AND',
                playerGroups: [{ operator: 'WITH', playerIds: ['a b&c'] }],
            })
        ).toContain('playerIds[0]=a%20b%26c');
    });
});
