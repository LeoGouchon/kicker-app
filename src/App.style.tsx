import {Flex, Layout} from "antd";
import styled from "@emotion/styled";

export const StyledLayout = styled(Layout)`
    min-height: 100vh;
`;

export const StyledContent = styled(Layout.Content)`
    margin: 0 16px;
`;

export const StyledMainContent = styled.div`
    padding: 24px;
    min-height: 360px;
    background-color: var(--ant-color-bg-container);
    border-radius: var(--ant-border-radius-lg);
`;

export const FlexFullWidth = styled(Flex)`
    width: 100%;
`;