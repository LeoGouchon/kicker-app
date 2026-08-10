import { type User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

import { identityConfig } from './config.ts';

export const oauthClient = new UserManager({
    authority: identityConfig.issuer,
    client_id: identityConfig.clientId,
    redirect_uri: identityConfig.redirectUri,
    post_logout_redirect_uri: identityConfig.postLogoutRedirectUri,
    response_type: 'code',
    scope: identityConfig.scope,
    resource: identityConfig.resource,
    loadUserInfo: false,
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTimeInSeconds: 60,
    userStore: new WebStorageStateStore({ store: globalThis.sessionStorage }),
});

// React StrictMode may mount the callback page twice in development. The
// authorization code is single-use, so both mounts must share one exchange.
let callbackPromise: Promise<User> | undefined;
let logoutCallbackPromise: Promise<void> | undefined;

const safeReturnTo = (value: string): string => {
    try {
        const url = new URL(value, globalThis.location.origin);
        return url.origin === globalThis.location.origin ? `${url.pathname}${url.search}${url.hash}` : '/';
    } catch {
        return '/';
    }
};

const randomNonce = (): string => {
    const bytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(bytes);
    return btoa(String.fromCodePoint(...bytes))
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replace(/=+$/, '');
};

export const login = async (returnTo = `${globalThis.location.pathname}${globalThis.location.search}`) =>
    oauthClient.signinRedirect({
        state: { returnTo: safeReturnTo(returnTo) },
        nonce: randomNonce(),
        prompt: 'login',
    });

export const handleCallback = (): Promise<User> => {
    callbackPromise ??= oauthClient
        .signinCallback()
        .then((user) => {
            if (!user) {
                throw new Error('Callback OAuth sans utilisateur');
            }

            return user;
        })
        .catch((error) => {
            // Allow a fresh login attempt after a failed callback.
            callbackPromise = undefined;
            throw error;
        });

    return callbackPromise;
};

export const getCurrentUser = () => oauthClient.getUser();

export const refreshSession = async (): Promise<User> => {
    const user = await oauthClient.signinSilent();
    if (!user) {
        throw new Error('La session OAuth est introuvable');
    }

    return user;
};

export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
    const endpoint = `${identityConfig.issuer}/oauth2/revoke`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token: refreshToken }),
    });
    if (!response.ok) {
        throw new Error(`Révocation OAuth refusée (HTTP ${response.status})`);
    }
};

export const logout = async (): Promise<void> => {
    const user = await getCurrentUser();
    try {
        if (user?.refresh_token) {
            await revokeRefreshToken(user.refresh_token);
        }
    } catch {
        void 0;
    }

    // oidc-client-ts generates and persists a cryptographically random state,
    // then removes the local user as part of signoutRedirect. The callback
    // validates that state before the session is considered fully closed.
    await oauthClient.signoutRedirect({
        post_logout_redirect_uri: identityConfig.postLogoutRedirectUri,
        state: randomNonce(),
        extraQueryParams: { client_id: oauthClient.settings.client_id },
    });
};

export const handleLogoutCallback = (): Promise<void> => {
    logoutCallbackPromise ??= oauthClient
        .signoutRedirectCallback()
        .then(async (response) => {
            if (!response.state) {
                throw new Error('Callback de logout sans state');
            }

            await oauthClient.removeUser();
        })
        .catch((error) => {
            logoutCallbackPromise = undefined;
            throw error;
        });

    return logoutCallbackPromise;
};

export const getAccessToken = async (): Promise<string | undefined> => {
    const user = await getCurrentUser();
    return user?.expired ? undefined : user?.access_token;
};
