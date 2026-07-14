import styled from '@emotion/styled';
import { Flex, type FlexProps, Layout, type LayoutProps } from 'antd';

export const StyledLayout = styled(Layout)<LayoutProps>`
    min-height: 100vh;
    max-width: 100vw;
    position: relative;
    display: flex;
    justify-content: center;
`;

export const StyledContent = styled(Layout.Content)<{ ismobile: boolean }>`
    margin: ${({ ismobile }) => (ismobile ? '0 8px' : '0 16px')};
`;

export const StyledMainContent = styled.div<{ ismobile: boolean }>`
    padding: ${({ ismobile }) => (ismobile ? '8px' : '24px')};
    min-height: 360px;
    background-color: var(--ant-color-bg-container);
    border-radius: var(--ant-border-radius-lg);

    display: flex;
    flex-direction: column;
    gap: ${({ ismobile }) => (ismobile ? '8px' : '16px')};
`;

export const FlexFullWidth = styled(Flex)<FlexProps>`
    width: 100%;
`;
