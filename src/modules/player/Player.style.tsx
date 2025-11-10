import styled from '@emotion/styled';
import { Card } from 'antd';

export const SmallCardStat = styled(Card)`
    flex: 1;
    height: 100%;
`;

export const SmallCardStatNoBorder = styled(SmallCardStat)`
    box-shadow: none !important;
`;

export const VerticalCardStats = styled(Card)`
    min-width: 200px;
    width: 100%;
`;
