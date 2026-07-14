import styled from '@emotion/styled';
import { Flex, Radio } from 'antd';

import { FlexFullWidth } from '../../App.style.tsx';

export const WrapperTeamSelection = styled(FlexFullWidth)`
    background-color: var(--ant-color-bg-layout);
    border-radius: var(--ant-border-radius-lg);
    padding: 8px;
    flex: 1;
`;

export const RadioGroupStyled = styled(Radio.Group)`
    display: flex;
    overflow-x: auto;
`;

export const FlexScoreWrapper = styled(Flex)`
    gap: 8px;
    flex-wrap: wrap;
`;
