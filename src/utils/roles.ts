import type { UserRole, UserType } from '../types/User.type.ts';

type UserWithRole = Pick<UserType, 'role'> | null | undefined;

export const hasRole = (user: UserWithRole, role: UserRole): boolean => user?.role === role;

export const hasAnyRole = (user: UserWithRole, roles: readonly UserRole[]): boolean =>
    user?.role !== undefined && roles.includes(user.role);

export const isAdmin = (user: UserWithRole): boolean => hasRole(user, 'ADMIN');

export const isModeratorOrAdmin = (user: UserWithRole): boolean => hasAnyRole(user, ['ADMIN', 'MODERATOR']);
