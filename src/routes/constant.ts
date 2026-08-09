export const ROUTES = {
    AUTH_CALLBACK: '/auth/callback',
    HISTORY: '/history',
    NEW_MATCH: '/new-match',
    PUBLIC_NEW_MATCH: '/public-new-match',
    KICKER_MATCH_CODES: '/admin/kicker-match-codes',
    CREATE_PLAYER: '/admin/create-player',
    RANKING: '/ranking',
    HOME: '/',
    NOT_FOUND: '*',
    INVITE: '/invite',
    STATS_HELPER: '/stats-helper',
    PLAYER: '/player',
    DUO: '/duo',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
