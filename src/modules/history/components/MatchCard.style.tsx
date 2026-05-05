import styled from '@emotion/styled';
import { Flex, Typography } from 'antd';

type Side = {
    side: 'left' | 'right';
};

export const GlobalWrapper = styled.div`
    width: 100%;
    max-width: 556px;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 8px;
    background-color: var(--ant-color-bg-container);
    border-radius: 8px;
    border: 1px solid var(--ant-btn-border-color);
    box-shadow: var(--ant-box-shadow-card);
    gap: var(--ant-margin-xs);
`;

export const HeaderWrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    gap: var(--ant-margin-xxs);
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex: 1;
    gap: var(--ant-margin-md);
    justify-content: center;
`;

export const TeamScore = styled(Typography.Title)`
    margin: 0 !important;
    padding: 0 !important;
    text-align: center;
`;

export const TeamPlayerWrapper = styled(Flex)<Side>`
    flex: 1;
    align-items: ${(props) => (props.side === 'right' ? 'flex-start' : 'flex-end')};
`;
