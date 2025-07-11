import {Segmented} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-regular-svg-icons";
import {useAntdTheme} from "../../../../context/ThemeProvider.tsx";

export const ThemeSwitcher = () => {
    const { isDarkTheme,toggleTheme } = useAntdTheme();
    const themeChoiceOptions = [
        {
            value: 'light',
            icon: <FontAwesomeIcon icon={faSun}/>,
        },
        {
            icon: <FontAwesomeIcon icon={faMoon}/>,
            value: 'dark',
        }
    ]

    const handleThemeChange = (value: string) => {
        if (value === 'light') {
            toggleTheme('light');
        }
        else if (value === 'dark') {
            toggleTheme('dark');
        }
    }

    return (
        <Segmented options={themeChoiceOptions} shape="round" onChange={handleThemeChange} defaultValue={isDarkTheme ? 'dark' : 'light'}/>
    )
}