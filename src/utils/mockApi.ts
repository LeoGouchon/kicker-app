import {mockLoginResponse} from "./mockApiResponse/login.ts";
import { mockMeResponse } from "./mockApiResponse/me.ts";

export const mockApi = {
    get: async (url: string, config?: any) => {
        switch (url) {
            case '/players': {
                return {
                    data: []
                };
            }
            case '/kicker/matches': {
                return {
                    data: []
                };
            }
            case '/me': {
                return mockMeResponse;
            }
            default: {
                throw new Error('Mock not implemented for url: ' + url);
            }
        }
    },
    post: async (url: string, data?: any, config?: any) => {
        switch (url) {
            case '/authenticate/login': {
                return mockLoginResponse;
            }
            default: {
                return {
                    data: []
                };
            }
        }
    }
}