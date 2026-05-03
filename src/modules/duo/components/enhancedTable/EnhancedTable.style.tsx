import styled from '@emotion/styled';
import { Typography } from 'antd';

const { Title } = Typography;

export const EnhancedTableCard = styled.div`
    width: 100%;
`;

export const TableTitle = styled(Title)`
    margin: 0 !important;
    padding: 0;
    line-height: 1;
`;

export const MetricTitle = styled.span`
    display: inline-block;
    white-space: normal;
    line-height: 1.2;
`;
