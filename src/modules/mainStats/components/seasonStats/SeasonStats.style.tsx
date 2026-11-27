import styled from '@emotion/styled';
import { Typography } from 'antd';

export const SeasonStatsNewText = styled(Typography.Text)`
    && {
        color: var(--ant-color-info);
    }
`;

export const SeasonStatsBlurredEloText = styled(Typography.Text)`
    filter: blur(3px);
    pointer-events: none;
    user-select: none;
`;
