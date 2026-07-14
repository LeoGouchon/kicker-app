import styled from '@emotion/styled';
import { Flex, Typography } from 'antd';

type MatchPlayersProps = {
    textAlign: 'left' | 'right';
};

export const MatchPlayers = styled(Flex)<MatchPlayersProps>`
    flex: 1 1 0;
    min-width: 0;
    justify-content: ${({ textAlign }) => (textAlign === 'right' ? 'flex-end' : 'flex-start')};
    text-align: ${({ textAlign }) => textAlign};

    > * {
        text-align: ${({ textAlign }) => textAlign};
    }
`;

export const MatchScore = styled(Typography.Text)`
    display: inline-block;
    min-width: 2ch;
    text-align: center;
`;

export const TimeSinceThisMatchText = styled(Typography.Text)`
    min-width: 20ch;
`;
