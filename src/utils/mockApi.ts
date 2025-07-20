import {mockLoginResponse} from "./mockApiResponse/mockedLogin.ts";
import {mockMeResponse} from "./mockApiResponse/mockedMe.ts";
import {mockMatchGetResponse, mockMatchPostResponse} from "./mockApiResponse/mockedMatch.ts";
import {mockPlayerGetResponse} from "./mockApiResponse/mockedPlayer.ts";

export const mockApi = {
    get: async (url: string) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        if (url.startsWith('/kicker/matches')) return mockMatchGetResponse;
        if (url.startsWith('/players')) return mockPlayerGetResponse;
        if (url === '/me') return mockMeResponse;

        throw new Error('Mock not implemented for url: ' + url);
    },
    post: async (url: string, data?: any) => {
        if (url === '/authenticate/login') return mockLoginResponse;
        if (url === '/authenticate/logout') return {data: {}};
        if (url.startsWith('/kicker/matches')) return mockMatchPostResponse(data);

        throw new Error('Mock not implemented for url: ' + url);
    }
}