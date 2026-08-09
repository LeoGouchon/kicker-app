import { type User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

import { frontendLogoutUri, identityConfig } from './config.ts';

export const oauthClient = new UserManager({
    authority: identityConfig.issuer,
    client_id: identityConfig.clientId,
    redirect_uri: identityConfig.redirectUri,
    post_logout_redirect_uri: frontendLogoutUri,
    response_type: 'code',
    scope: identityConfig.scope,
    resource: identityConfig.resource,
    loadUserInfo: false,
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTimeInSeconds: 60,
    userStore: new WebStorageStateStore({ store: globalThis.sessionStorage }),
});

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
    oauthClient.signinRedirect({ state: { returnTo: safeReturnTo(returnTo) }, nonce: randomNonce() });

export const handleCallback = async (): Promise<User> => {
    const user = await oauthClient.signinCallback();
    if (!user) {
        throw new Error('Callback OAuth sans utilisateur');
    }

    return user;
};

export const getCurrentUser = () => oauthClient.getUser();

export const refreshSession = async (): Promise<User> => {
    const user = await oauthClient.signinSilent();
    if (!user) {
        throw new Error('La session OAuth est introuvable');
    }

    return user;
};

export const getUserInfo = async (accessToken: string): Promise<Record<string, unknown>> => {
    const metadata = await oauthClient.metadataService.getMetadata();
    const endpoint = metadata.userinfo_endpoint;
    if (!endpoint) {
        throw new Error('userinfo_endpoint absent de la découverte OpenID');
    }

    const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
        throw new Error(`userinfo a répondu HTTP ${response.status}`);
    }

    return (await response.json()) as Promise<Record<string, unknown>>;
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
        // La session locale et la session du provider doivent tout de même être nettoyées.
    } finally {
        await oauthClient.removeUser();
    }
    const metadata = await oauthClient.metadataService.getMetadata();
    const endpoint = metadata.end_session_endpoint ?? `${identityConfig.issuer}/connect/logout`;
    globalThis.location.assign(`${endpoint}?${new URLSearchParams({ post_logout_redirect_uri: frontendLogoutUri })}`);
};

export const getAccessToken = async (): Promise<string | undefined> => {
    const user = await getCurrentUser();
    return user?.expired ? undefined : user?.access_token;
};
