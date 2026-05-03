import styled from '@emotion/styled';
import { Tag, type TagProps, Typography } from 'antd';

const { Title } = Typography;

export const EnhancedTableCard = styled.div`
    width: 100%;
`;

export const TableTitle = styled(Title)`
    margin: 0 !important;
    padding: 0;
    line-height: 1;
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
