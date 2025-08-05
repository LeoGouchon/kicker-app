import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {
        screenSize: number;
        isDarkTheme: boolean;
    }
}
