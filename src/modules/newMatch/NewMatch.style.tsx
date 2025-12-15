import styled from '@emotion/styled';

import { FlexFullWidth } from '../../App.style.tsx';

export const WrapperTeamSelection = styled(FlexFullWidth)<{ team: '1' | '2' }>`
    background-color: ${(props) => (props.team === '1' ? 'var(--ant-color-bg-layout)' : 'var(--ant-color-bg-layout)')};
    border-radius: var(--ant-border-radius-lg);
    padding: 8px;
`;
