/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_IS_ADMIN: 'true' | 'false';
    readonly VITE_MODE: 'dev' | 'prod';
    readonly VITE_BACKEND_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}