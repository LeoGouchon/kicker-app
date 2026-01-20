import styled from '@emotion/styled';

export const ValueCell = styled.div<{ normalizedValue: number; isGain: boolean; scoreDifference: number }>`
    background-color: ${({ normalizedValue, isGain }) => {
        const value = isGain ? 1 - normalizedValue : normalizedValue;
        const opacity = 0.8;
        return `rgba(${value}, ${200 - (255 / 6) * value}, ${255 - (255 / 3) * value}, ${(value + 0.05) * opacity})`;
    }};
    ${({ scoreDifference }) => scoreDifference === 0 && 'border-left: 1px solid #444444;'}
`;
