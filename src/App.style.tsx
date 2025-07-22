import styled from '@emotion/styled';
import {Flex, type FlexProps, Layout, type LayoutProps} from 'antd';

export const StyledLayout = styled(Layout)<LayoutProps>`
    min-height: 100vh;
    max-width: 100vw;
    position: relative;
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

export const FlexFullWidth = styled(Flex)<FlexProps>`
    width: 100%;
`;