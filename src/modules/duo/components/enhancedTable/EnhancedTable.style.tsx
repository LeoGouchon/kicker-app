import styled from '@emotion/styled';
import { Tag, type TagProps } from 'antd';

export const EnhancedTableCard = styled.div`
    width: 100%;

    .ant-table-cell.kicker-stat-column-even {
        background-color: color-mix(in srgb, var(--ant-color-bg-container), var(--ant-color-text) 1.5%);
    }

    .ant-table-tbody > tr.ant-table-row:hover > .ant-table-cell.kicker-stat-column-even {
        background-color: var(--ant-color-fill-alter);
    }
`;

type RankTagProps = {
    rankTone?: 'gold' | 'silver' | 'bronze' | 'top' | 'bottom';
} & TagProps;

export type RankTone = NonNullable<RankTagProps['rankTone']>;

export const RankTag = styled(Tag, {
    shouldForwardProp: (prop) => prop !== 'rankTone',
})<RankTagProps>`
    ${({ rankTone }) => (rankTone ? `background-color: var(--kicker-tag-${rankTone}-bg);` : '')}
    ${({ rankTone }) => (rankTone ? `color: var(--kicker-tag-${rankTone}-color);` : '')}
    padding: 2px 0;
    width: 100%;
    text-align: center;
`;
