import {StyledHeader} from "./Header.style.tsx";
import {Avatar, Segmented} from "antd";
import {faMoon, faSun} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Header = () => {
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
    return (
        <StyledHeader>
            <Segmented options={themeChoiceOptions} shape="round"/>
            <Avatar>A</Avatar>
        </StyledHeader>
    )
}