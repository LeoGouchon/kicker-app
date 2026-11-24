import styled from '@emotion/styled';
import { Typography } from 'antd';

export const DeltaIndicatorText = styled(Typography.Text, {
    shouldForwardProp: (prop) => prop !== 'trend',
})<{ trend: 'up' | 'down' }>`
    && {
        color: ${({ trend }) => (trend === 'up' ? 'var(--ant-color-success)' : 'var(--ant-color-error)')};
    }
`;
