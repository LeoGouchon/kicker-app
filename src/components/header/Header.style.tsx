import styled from '@emotion/styled';
import {Layout} from 'antd';

export const StyledHeader = styled(Layout.Header)`
    background-color: var(--ant-color-bg-container);      
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: var(--ant-border-radius-lg);
    border-bottom-right-radius: var(--ant-border-radius-lg);
    
    gap: 16px;
    margin-bottom: 8px;
    margin-left: 16px;
    margin-right: 16px;
`;