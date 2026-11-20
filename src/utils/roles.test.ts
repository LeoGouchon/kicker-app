import { describe, expect, it } from 'vitest';

import type { UserRole, UserType } from '../types/User.type.ts';
import { hasAnyRole, hasRole, isAdmin, isModeratorOrAdmin } from './roles.ts';

type UserWithRole = Pick<UserType, 'role'> | null | undefined;

const withoutRole = {} as Pick<UserType, 'role'>;

describe('hasRole', () => {
    it.each<[string, UserWithRole, UserRole, boolean]>([
        ['the user has the role', { role: 'ADMIN' }, 'ADMIN', true],
        ['the user has another role', { role: 'USER' }, 'ADMIN', false],
        ['the user is null', null, 'ADMIN', false],
        ['the user is undefined', undefined, 'ADMIN', false],
        ['the user has no role', withoutRole, 'ADMIN', false],
    ])('returns the expected value when %s', (_, user, role, expected) => {
        expect(hasRole(user, role)).toBe(expected);
    });
});

describe('hasAnyRole', () => {
    it.each<[string, UserWithRole, UserRole[], boolean]>([
        ['the user has one of the roles', { role: 'MODERATOR' }, ['ADMIN', 'MODERATOR'], true],
        ['the user has none of the roles', { role: 'USER' }, ['ADMIN', 'MODERATOR'], false],
        ['the role list is empty', { role: 'ADMIN' }, [], false],
        ['the user is null', null, ['ADMIN', 'MODERATOR'], false],
        ['the user is undefined', undefined, ['ADMIN', 'MODERATOR'], false],
        ['the user has no role', withoutRole, ['ADMIN', 'MODERATOR'], false],
    ])('returns the expected value when %s', (_, user, roles, expected) => {
        expect(hasAnyRole(user, roles)).toBe(expected);
    });
});

describe('isAdmin', () => {
    it.each<[string, UserWithRole, boolean]>([
        ['an admin', { role: 'ADMIN' }, true],
        ['a moderator', { role: 'MODERATOR' }, false],
        ['a user', { role: 'USER' }, false],
        ['null', null, false],
        ['undefined', undefined, false],
    ])('returns the expected value for %s', (_, user, expected) => {
        expect(isAdmin(user)).toBe(expected);
    });
});

describe('isModeratorOrAdmin', () => {
    it.each<[string, UserWithRole, boolean]>([
        ['an admin', { role: 'ADMIN' }, true],
        ['a moderator', { role: 'MODERATOR' }, true],
        ['a user', { role: 'USER' }, false],
        ['null', null, false],
        ['undefined', undefined, false],
    ])('returns the expected value for %s', (_, user, expected) => {
        expect(isModeratorOrAdmin(user)).toBe(expected);
    });
});
