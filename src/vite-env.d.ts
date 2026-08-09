/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_IS_ADMIN: 'true' | 'false';
    readonly VITE_MODE: 'dev' | 'prod';
    readonly VITE_MOCK_API?: 'true' | 'false';
    readonly VITE_IDENTITY_ISSUER: string;
    readonly VITE_IDENTITY_CLIENT_ID: string;
    readonly VITE_IDENTITY_REDIRECT_URI: string;
    readonly VITE_IDENTITY_RESOURCE: string;
    readonly VITE_IDENTITY_SCOPE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
