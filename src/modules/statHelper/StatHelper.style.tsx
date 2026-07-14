import styled from '@emotion/styled';
import { Flex, Typography } from 'antd';

export const ExplanationSection = styled(Flex)`
    padding: 16px;
    border: 1px solid var(--ant-color-border-secondary);
    border-radius: 8px;
    background: var(--ant-color-fill-quaternary);
`;

export const ExplanationColumns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
`;

export const ExplanationBlock = styled(Flex)`
    min-width: 0;
`;

export const ExplanationList = styled.ul`
    margin: 0;
    padding-left: 20px;
`;

export const ExplanationListItem = styled.li`
    margin-bottom: 8px;

    &:last-of-type {
        margin-bottom: 0;
    }
`;

export const InlineFormula = styled(Typography.Text)`
    font-family: var(--ant-font-family-code);
`;

export const ValueCell = styled.div<{ normalizedValue: number; isGain: boolean; scoreDifference: number }>`
    background-color: ${({ normalizedValue, isGain }) => {
        const value = isGain ? 1 - normalizedValue : normalizedValue;
        const opacity = 0.8;
        return `rgba(${value}, ${200 - (255 / 6) * value}, ${255 - (255 / 3) * value}, ${(value + 0.05) * opacity})`;
    }};
    ${({ scoreDifference }) => scoreDifference === 0 && 'border-left: 1px solid #444444;'}
`;
