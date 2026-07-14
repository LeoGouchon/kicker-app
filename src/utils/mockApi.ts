import { mockLoginResponse } from './mockApiResponse/mockedLogin.ts';
import { mockMatchGetResponse, mockMatchPostResponse } from './mockApiResponse/mockedMatch.ts';
import { mockMeResponse } from './mockApiResponse/mockedMe.ts';
import { mockPlayerGetResponse } from './mockApiResponse/mockedPlayer.ts';

export const mockApi = {
    get: async (url: string) => {
        await new Promise((resolve) => setTimeout(resolve, 200));

        let data;
        if (url.startsWith('/kicker/matches')) data = mockMatchGetResponse;
        else if (url === '/admin/kicker-match-codes')
            data = [
                {
                    id: 'mock-code-id',
                    code: 'SUMMER2026',
                    status: 'ACTIVE',
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                    lastUsedAt: null,
                    usageCount: 2,
                    revokedAt: null,
                    revokedReason: null,
                    createdByUserId: 'mock-user-id',
                },
            ];
        else if (url.startsWith('/players')) data = mockPlayerGetResponse;
        else if (url.startsWith('/teams'))
            data = [
                {
                    id: 'mock-team-id',
                    name: 'Kicker',
                },
            ];
        else if (url === '/me') data = mockMeResponse;
        else throw new Error('Mock not implemented for url: ' + url);

        return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url },
        };
    },
    post: async (url: string, data?: unknown, config?: unknown) => {
        let responseData;
        if (url === '/authenticate/login') responseData = mockLoginResponse;
        else if (url.startsWith('/authenticate/signup')) responseData = mockLoginResponse;
        else if (url === '/authenticate/refresh-token') responseData = { token: 'mock-access-token' };
        else if (url === '/authenticate/logout') responseData = {};
        else if (url === '/admin/kicker-match-codes') {
            responseData = {
                id: Math.random().toString(),
                code: 'SUMMER2026',
                status: 'ACTIVE',
                createdAt: Date.now(),
                expiresAt: null,
                lastUsedAt: null,
                usageCount: 0,
                revokedAt: null,
                revokedReason: null,
                createdByUserId: 'mock-user-id',
            };
        } else if (url === '/kicker/matches/public') {
            const publicMatchData = data as { match?: Parameters<typeof mockMatchPostResponse>[0] };
            responseData = mockMatchPostResponse(publicMatchData.match ?? {});
        } else if (url === '/players') {
            responseData = {
                id: Math.random().toString(),
                ...(data as object),
            };
        } else if (url.startsWith('/kicker/matches')) {
            responseData = mockMatchPostResponse(data as Parameters<typeof mockMatchPostResponse>[0]);
        } else throw new Error('Mock not implemented for url: ' + url);

        return {
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url, data, requestConfig: config },
        };
    },
    delete: async (url: string) => {
        console.log('delete', url);
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { status: 200, statusText: 'OK' };
    },
    patch: async (url: string) => {
        if (url.startsWith('/admin/kicker-match-codes/')) {
            return {
                data: {
                    id: url.split('/').at(-2) ?? 'mock-code-id',
                    code: 'SUMMER2026',
                    status: 'REVOKED',
                    createdAt: Date.now(),
                    expiresAt: null,
                    lastUsedAt: null,
                    usageCount: 0,
                    revokedAt: Date.now(),
                    revokedReason: 'MANUAL',
                    createdByUserId: 'mock-user-id',
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { url },
            };
        }

        throw new Error('Mock not implemented for url: ' + url);
    },
};
