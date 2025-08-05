import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
    const [screenSize, setScreenSize] = useState<number>(0);

    const getScreenSize = () => {
        const width = window.innerWidth;
        if (width < 640) return 0;
        if (width < 1024) return 1;
        if (width < 1440) return 2;
        return 3;
    };

    useEffect(() => {
        const updateSize = () => setScreenSize(getScreenSize());
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const emotionTheme = useMemo(
        () => ({
            screenSize,
            isDarkTheme: themeState === 'dark',
        }),
        [screenSize, themeState]
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
                <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
