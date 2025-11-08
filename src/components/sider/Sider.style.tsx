import styled from '@emotion/styled';
import { Layout, type SiderProps } from 'antd';

export const StyledSider = styled(Layout.Sider)<SiderProps>`
    position: sticky;
    top: 8px;
    border-radius: 16px;
    margin: 8px;
    overflow: hidden;
    height: calc(100dvh - 16px);
    min-height: calc(100dvh - 16px);

    & > .ant-layout-sider-trigger {
        margin-bottom: 8px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
`;
