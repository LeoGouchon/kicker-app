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

    const tagStyle = useMemo(
        () =>
            ({
                '--kicker-tag-gold-bg': 'rgba(212, 175, 55, 0.22)',
                '--kicker-tag-gold-color': themeState === 'dark' ? '#f1ba30' : '#6e5202',
                '--kicker-tag-silver-bg': 'rgba(192, 192, 192, 0.28)',
                '--kicker-tag-silver-color': themeState === 'dark' ? '#d8d8d8' : '#5f6368',
                '--kicker-tag-bronze-bg': 'rgba(205, 127, 50, 0.24)',
                '--kicker-tag-bronze-color': themeState === 'dark' ? '#f0b37e' : '#8a4b15',
                '--kicker-tag-top-bg': 'rgba(82, 196, 26, 0.16)',
                '--kicker-tag-top-color': themeState === 'dark' ? '#95de64' : '#237804',
                '--kicker-tag-bottom-bg': 'rgba(255, 77, 79, 0.14)',
                '--kicker-tag-bottom-color': themeState === 'dark' ? '#ff7875' : '#a8071a',
            }) as React.CSSProperties,
        [themeState]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <ConfigProvider
                tag={{
                    style: tagStyle,
                }}
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
