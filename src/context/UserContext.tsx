import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { getCurrentUser, getUserInfo, logout, oauthClient, refreshSession } from '../auth/client.ts';
import type { AuthState } from '../auth/types.ts';
import type { UserType } from '../types/User.type.ts';
import { api } from '../utils/api.ts';

interface UserContextType {
    user?: UserType;
    authState: AuthState;
    setUser: (user: UserType | undefined) => void;
    clearSession: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    authState: 'initializing',
    setUser: () => undefined,
    clearSession: () => undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | undefined>();
    const [authState, setAuthState] = useState<AuthState>('initializing');

    const clearSession = useCallback(() => {
        setUser(undefined);
        setAuthState('anonymous');
    }, []);

    useEffect(() => {
        const handleAccessTokenExpired = () => {
            clearSession();
            void logout();
        };

        oauthClient.events.addAccessTokenExpired(handleAccessTokenExpired);
        return () => oauthClient.events.removeAccessTokenExpired(handleAccessTokenExpired);
    }, [clearSession]);

    useEffect(() => {
        let active = true;
        void (async () => {
            try {
                let oauthUser = await getCurrentUser();
                if (!oauthUser) {
                    if (active) setAuthState('anonymous');
                    return;
                }

                if (oauthUser.expired) {
                    oauthUser = await refreshSession();
                }

                await getUserInfo(oauthUser.access_token);
                const response = await api.get('/me');
                if (active) {
                    setUser(response.data as UserType);
                    setAuthState('authenticated');
                }
            } catch {
                if (active) {
                    setUser(undefined);
                    setAuthState('anonymous');
                }
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const value = useMemo(() => ({ user, authState, setUser, clearSession }), [user, authState, clearSession]);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
