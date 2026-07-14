import { App, Button, Divider, Flex, Space, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useContext } from 'react';

import { LinkPlayer } from '../../../components/linkPlayer/LinkPlayer.tsx';
import { SeasonTag } from '../../../components/seasonTag/SeasonTag.tsx';
import { UserContext } from '../../../context/UserContext.tsx';
import { useDeleteMatch } from '../../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../../types/Match.type.ts';
import {
    ContentWrapper,
    GlobalWrapper,
    HeaderWrapper,
    PlayerEloText,
    PlayerWithEloWrapper,
    TeamPlayerWrapper,
    TeamScore,
} from './MatchCard.style.tsx';

type props = {
    match: Match;
    fullWidth?: boolean;
    highlightPlayerId?: string;
};

const { Text } = Typography;
const DELETE_MATCH_DAYS = 7;

export const MatchCard = ({ match, fullWidth = false, highlightPlayerId }: props) => {
    const { modal, message } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const user = useContext(UserContext).user;
    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

    const deleteMatch = useDeleteMatch();

    const isTeamAWin = match.scoreA > match.scoreB;
    const isHighlightedPlayerInTeamA =
        highlightPlayerId === match.player1A.id || (match.player2A && highlightPlayerId === match.player2A?.id);
    const isHighlightedPlayerInTeamB =
        highlightPlayerId === match.player1B.id || (match.player2B && highlightPlayerId === match.player2B?.id);
    const highlightedResultType =
        (isHighlightedPlayerInTeamA && isTeamAWin) || (isHighlightedPlayerInTeamB && !isTeamAWin)
            ? 'success'
            : 'danger';
    const highlightedScoreType = {
        teamA: isHighlightedPlayerInTeamA ? highlightedResultType : undefined,
        teamB: isHighlightedPlayerInTeamB ? highlightedResultType : undefined,
    } as const;

    const renderPlayerWithElo = (player: Match['player1A'], eloPosition: 'before' | 'after') => {
        const highlightType = highlightPlayerId === player.id ? highlightedResultType : undefined;
        const elo = (
            <PlayerEloText type={highlightType ?? 'secondary'}>
                ({player.globalEloBeforeMatch || '???'}/{player.seasonalEloBeforeMatch || '???'})
            </PlayerEloText>
        );
        const playerName = <LinkPlayer highlightType={highlightType} player={player} />;

        return (
            <PlayerWithEloWrapper
                vertical={isMobile}
                gap={isMobile ? 0 : 4}
                align={isMobile ? (eloPosition === 'before' ? 'flex-end' : 'flex-start') : 'baseline'}
            >
                {isMobile || eloPosition === 'after' ? (
                    <>
                        {playerName}
                        {elo}
                    </>
                ) : (
                    <>
                        {elo}
                        {playerName}
                    </>
                )}
            </PlayerWithEloWrapper>
        );
    };

    const handleDelete = (id: string) => {
        modal.confirm({
            title: 'Supprimer le match',
            content: 'Voulez-vous vraiment supprimer ce match ?',
            okText: 'Oui',
            cancelText: 'Non',
            onOk: () =>
                deleteMatch.mutate(id, {
                    onSuccess: () => message.success('Match supprimé'),
                    onError: () => message.error('Erreur lors de la suppression du match'),
                }),
        });
    };

    return (
        <GlobalWrapper fullWidth={fullWidth}>
            <HeaderWrapper>
                <Flex align={'center'}>
                    <Space>
                        <Text style={{ fontSize: '12px' }} type={'secondary'}>
                            Général/Saison :
                        </Text>
                        <Text style={{ fontSize: '12px' }}>
                            ±{match.deltaElo} / {match.deltaEloSeasonal}
                        </Text>
                    </Space>
                </Flex>
                <Flex gap={isMobile ? '' : 'small'} align={'center'} vertical={isMobile} justify={'space-between'}>
                    <Text type={'secondary'} style={{ fontSize: '12px' }}>
                        {formatDate(match.createdAt)}
                    </Text>
                    <SeasonTag date={match.createdAt} />
                </Flex>
            </HeaderWrapper>

            <Divider style={{ margin: 0 }} />

            <ContentWrapper>
                <TeamPlayerWrapper vertical gap={'small'} side="left">
                    {renderPlayerWithElo(match.player1A, 'before')}
                    {match.player2A && renderPlayerWithElo(match.player2A, 'before')}
                </TeamPlayerWrapper>

                <Flex vertical flex={1} align={'center'}>
                    <Flex flex={1} justify="center" align="center" gap={'small'}>
                        <TeamScore level={2} type={highlightedScoreType.teamA}>
                            {match.scoreA}
                        </TeamScore>
                        -
                        <TeamScore level={2} type={highlightedScoreType.teamB}>
                            {match.scoreB}
                        </TeamScore>
                    </Flex>
                    <Flex flex={1} justify="center" align="center" gap={'medium'}>
                        <Text type={match.scoreA > match.scoreB && !highlightPlayerId ? 'success' : 'secondary'}>
                            {Math.round(match.winChanceTeamA * 100)}%
                        </Text>
                        <Text type={match.scoreB > match.scoreA && !highlightPlayerId ? 'success' : 'secondary'}>
                            {Math.round(match.winChanceTeamB * 100)}%
                        </Text>
                    </Flex>
                </Flex>

                <TeamPlayerWrapper vertical gap={'small'} side="right">
                    {renderPlayerWithElo(match.player1B, 'after')}
                    {match.player2B && renderPlayerWithElo(match.player2B, 'after')}
                </TeamPlayerWrapper>
            </ContentWrapper>
            {user && user.admin && (
                <>
                    <Divider style={{ margin: 0 }} />
                    <Flex justify={'end'}>
                        <Button
                            danger
                            type={'text'}
                            size={'small'}
                            disabled={
                                new Date(Date.now() - DELETE_MATCH_DAYS * 24 * 60 * 60 * 1000) >
                                new Date(match.createdAt)
                            }
                            onClick={() => handleDelete(match.id)}
                        >
                            Supprimer
                        </Button>
                    </Flex>
                </>
            )}
        </GlobalWrapper>
    );
};
