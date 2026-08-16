import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { getCurrentUser, logout, oauthClient, refreshSession } from '../auth/client.ts';
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

let currentProfilePromise: Promise<void> | undefined;

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | undefined>();
    const [authState, setAuthState] = useState<AuthState>('initializing');

    const clearSession = useCallback(() => {
        setUser(undefined);
        setAuthState('anonymous');
    }, []);

    const loadCurrentProfile = useCallback(() => {
        currentProfilePromise ??= (async () => {
            try {
                let oauthUser = await getCurrentUser();
                if (!oauthUser) {
                    setAuthState('anonymous');
                    return;
                }

                if (oauthUser.expired) {
                    oauthUser = await refreshSession();
                }

                const response = await api.get('/me');
                setUser(response.data as UserType);
                setAuthState('authenticated');
            } catch {
                setUser(undefined);
                setAuthState('anonymous');
            } finally {
                currentProfilePromise = undefined;
            }
        })();

        return currentProfilePromise;
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
        // signinCallback emits userLoaded after the code/token exchange. This
        // also handles the first login without requiring a page refresh.
        const handleUserLoaded = () => void loadCurrentProfile();
        oauthClient.events.addUserLoaded(handleUserLoaded);
        void loadCurrentProfile();

        return () => oauthClient.events.removeUserLoaded(handleUserLoaded);
    }, [loadCurrentProfile]);

    const value = useMemo(() => ({ user, authState, setUser, clearSession }), [user, authState, clearSession]);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
