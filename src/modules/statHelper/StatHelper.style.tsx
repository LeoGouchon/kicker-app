import styled from '@emotion/styled';

export const ValueCell = styled.div<{ normalizedValue: number; isGain: boolean; scoreDifference: number }>`
    background-color: ${({ normalizedValue, isGain, scoreDifference }) => {
        const value = isGain ? 1 - normalizedValue : normalizedValue;
        const opacity = scoreDifference >= 0 ? 1 : 0.4;
        return `rgba(${255 * value}, ${255 - (255 / 5) * value}, ${255 - (255 / 2) * value}, ${value * opacity})`;
    }};
    ${({ scoreDifference }) => scoreDifference === 0 && 'border-left: 1px solid #444444;'}
`;
