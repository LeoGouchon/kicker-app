export type IdentityConfig = {
    issuer: string;
    clientId: string;
    redirectUri: string;
    resource: string;
    scope: string;
};

const required = (value: string | undefined, name: string): string => {
    if (!value) {
        throw new Error(`Variable d'environnement manquante : VITE_${name}`);
    }

    return value;
};

export const identityConfig: IdentityConfig = {
    issuer: required(import.meta.env.VITE_IDENTITY_ISSUER, 'IDENTITY_ISSUER').replace(/\/$/, ''),
    clientId: required(import.meta.env.VITE_IDENTITY_CLIENT_ID, 'IDENTITY_CLIENT_ID'),
    redirectUri: required(import.meta.env.VITE_IDENTITY_REDIRECT_URI, 'IDENTITY_REDIRECT_URI'),
    resource: required(import.meta.env.VITE_IDENTITY_RESOURCE, 'IDENTITY_RESOURCE'),
    scope: required(import.meta.env.VITE_IDENTITY_SCOPE, 'IDENTITY_SCOPE'),
};

export const frontendLogoutUri = `${globalThis.location.origin}/`;
