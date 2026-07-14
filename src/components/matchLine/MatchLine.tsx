import { Flex, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

import { FlexFullWidth } from '../../App.style.tsx';
import type { Match } from '../../types/Match.type.ts';
import { LinkPlayer } from '../linkPlayer/LinkPlayer.tsx';
import { MatchPlayers, MatchScore, TimeSinceThisMatchText } from './MatchLine.style.tsx';

const { Text } = Typography;

type MatchLineProps = {
    match: Match;
    isSmall?: boolean;
};

export const MatchLine = ({ match, isSmall = false }: MatchLineProps) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const relativeTimePaster = (date: string) => {
        const now = new Date();
        const dateObj = new Date(date);
        const diff = now.getTime() - dateObj.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} jour${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return "moins d'une minute";
        }
    };

    const isSmallSize = isSmall || isMobile;

    return (
        <FlexFullWidth vertical={isSmallSize}>
            <TimeSinceThisMatchText type={'secondary'}>
                Il y a {relativeTimePaster(match.createdAt)}
            </TimeSinceThisMatchText>
            <Flex flex={1} gap={'medium'} justify={'center'} align={'center'}>
                <MatchPlayers vertical={isSmallSize} textAlign={'right'} gap={isSmallSize ? undefined : 'small'}>
                    <LinkPlayer player={match.player1A} />
                    {!isSmallSize && <Text type={'secondary'}>·</Text>}
                    {match.player2A && <LinkPlayer player={match.player2A} />}
                </MatchPlayers>
                <Flex gap={'small'}>
                    <MatchScore strong>{match.scoreA}</MatchScore>
                    <Text type={'secondary'} style={{ flexWrap: 'nowrap' }}>
                        vs
                    </Text>
                    <MatchScore strong>{match.scoreB}</MatchScore>
                </Flex>
                <MatchPlayers vertical={isSmallSize} textAlign={'left'} gap={isSmallSize ? undefined : 'small'}>
                    <LinkPlayer player={match.player1B} />
                    {!isSmallSize && <Text type={'secondary'}>·</Text>}
                    {match.player2B && <LinkPlayer player={match.player2B} />}
                </MatchPlayers>
            </Flex>
        </FlexFullWidth>
    );
};
