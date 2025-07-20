import {mockLoginResponse} from "./mockApiResponse/mockedLogin.ts";
import {mockMeResponse} from "./mockApiResponse/mockedMe.ts";
import {mockMatchGetResponse, mockMatchPostResponse} from "./mockApiResponse/mockedMatch.ts";
import {mockPlayerGetResponse} from "./mockApiResponse/mockedPlayer.ts";

export const mockApi = {
    get: async (url: string) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        let data;
        if (url.startsWith('/kicker/matches')) data = mockMatchGetResponse;
        else if (url.startsWith('/players')) data = mockPlayerGetResponse;
        else if (url === '/me') data = mockMeResponse;
        else throw new Error('Mock not implemented for url: ' + url);

        return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url }
        };
    },
    post: async (url: string, data?: unknown) => {
        let responseData;
        if (url === '/authenticate/login') responseData = mockLoginResponse;
        else if (url === '/authenticate/refresh-token') responseData = { token: 'mock-refresh-token' };
        else if (url === '/authenticate/logout') responseData = {};
        else if (url.startsWith('/kicker/matches')) responseData = mockMatchPostResponse(data as Parameters<typeof mockMatchPostResponse>[0]);
        else throw new Error('Mock not implemented for url: ' + url);

        return {
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url, data }
        };
    },
    delete: async (url: string) => {
        console.log('delete', url);
        await new Promise(resolve => setTimeout(resolve, 200));
        return { status: 200, statusText: 'OK' };
    }
}