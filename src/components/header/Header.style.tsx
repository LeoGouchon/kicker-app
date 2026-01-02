import styled from '@emotion/styled';
import { Layout, Menu, type MenuProps } from 'antd';

export const StyledHeader = styled(Layout.Header)<{ ismobile: boolean }>`
    background-color: var(--ant-color-bg-container);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: var(--ant-border-radius-lg);
    border-bottom-right-radius: var(--ant-border-radius-lg);

    gap: 16px;
    margin-bottom: 8px;
    padding: ${({ ismobile }) => (ismobile ? '0 16px' : '0 50px')};
    margin-left: ${({ ismobile }) => (ismobile ? '8px' : '16px')};
    margin-right: ${({ ismobile }) => (ismobile ? '8px' : '16px')};

    ${({ ismobile }) =>
        ismobile &&
        `
        position: sticky;
        top: 0;
        z-index: 1000;
        
        border-top-left-radius: var(--ant-border-radius-lg);
        border-top-right-radius: var(--ant-border-radius-lg);
        margin-top: 8px;
    `}
`;

export const StyledMenu = styled(Menu)<MenuProps>`
    background-color: transparent !important;
    border: none !important;
`;
