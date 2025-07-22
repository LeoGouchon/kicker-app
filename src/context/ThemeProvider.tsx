import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { createContext, useContext,useState } from 'react';

interface ThemeContextType {
    isDarkTheme: boolean;
    toggleTheme: (newTheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkTheme: false,
    toggleTheme: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAntdTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [themeState, setThemeState] = useState<'light' | 'dark'>(localStorage.theme ?? 'light');

    const themeContextValue = React.useMemo(
        () => ({
            isDarkTheme: themeState === 'dark',
            toggleTheme: (newTheme: 'light' | 'dark'): void => {
                setThemeState(newTheme);
                localStorage.theme = newTheme;
            },
        }),
        [themeState, setThemeState]
    );

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <ConfigProvider
                theme={{
                    algorithm: themeState === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    cssVar: true,
                    components: {
                        Layout: {
                            lightTriggerBg: 'transparent',
                            triggerBg: 'transparent',
                        }
                    }
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
