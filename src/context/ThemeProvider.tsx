import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface ThemeContextType {
    isDarkTheme: boolean;
    toggleTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkTheme: false,
    toggleTheme: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAntdTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [themeState, setThemeState] = useState<'light' | 'dark'>(localStorage.theme ?? 'light');

    const emotionTheme = useMemo(
        () => ({
            isDarkTheme: themeState === 'dark',
        }),
        [themeState]
    );

    const contextValue = useMemo(
        () => ({
            isDarkTheme: themeState === 'dark',
            toggleTheme: (newTheme: 'light' | 'dark') => {
                setThemeState(newTheme);
                localStorage.theme = newTheme;
            },
        }),
        [themeState]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <ConfigProvider
                theme={{
                    algorithm: themeState === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    cssVar: true,
                }}
            >
                <AntdApp>
                    <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
                </AntdApp>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
