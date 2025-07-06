import {StyledHeader} from "./Header.style.tsx";
import {Avatar, Flex, Tag} from "antd";
import {isDev} from "../../utils/envChoice.ts";
import {ThemeSwitcher} from "./components/themeSwitcher/ThemeSwitcher.tsx";

export const Header = () => {
    return (
        <StyledHeader>
            {isDev ? <Tag color={'error'}>Dev mode</Tag> : <Tag color={'success'}>Current live!</Tag>}
            <Flex gap={'middle'}>
                <ThemeSwitcher/>
                <Avatar>A</Avatar>
            </Flex>
        </StyledHeader>
    )
}