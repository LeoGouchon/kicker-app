export const getReturnTo = (state: unknown): string => {
    if (typeof state !== 'object' || state === null || !('returnTo' in state)) return '/';
    const returnTo = (state as { returnTo?: unknown }).returnTo;
    return typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
};
