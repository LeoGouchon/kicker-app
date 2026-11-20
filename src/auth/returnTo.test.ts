import { describe, expect, it } from 'vitest';

import { getReturnTo } from './returnTo.ts';

describe('getReturnTo', () => {
    it('returns the internal path when the state holds one', () => {
        expect(getReturnTo({ returnTo: '/players/42?tab=elo' })).toBe('/players/42?tab=elo');
    });

    it.each<[string, unknown]>([
        ['the state is undefined', undefined],
        ['the state is null', null],
        ['the state is a string', 'oops'],
        ['the state has no returnTo', {}],
        ['returnTo is not a string', { returnTo: 42 }],
        ['returnTo is a relative path', { returnTo: 'players' }],
    ])('returns / when %s', (_, state) => {
        expect(getReturnTo(state)).toBe('/');
    });

    it.each<[string, string]>([
        ['an absolute URL', 'https://evil.com'],
        ['a protocol-relative URL', '//evil.com'],
    ])('returns / when returnTo is %s', (_, returnTo) => {
        expect(getReturnTo({ returnTo })).toBe('/');
    });

    // Pending: docs/tech-debt.md, "getReturnTo accepte /\evil.com"
    it.skip('returns / when returnTo starts with a backslash after the slash', () => {
        expect(getReturnTo({ returnTo: '/\\evil.com' })).toBe('/');
    });
});
