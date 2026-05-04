import { Col, Flex, List, Row, Space, Tag, Typography } from 'antd';
import React from 'react';

import { LinkPlayer } from '../../../components/linkPlayer/LinkPlayer.tsx';
import type { Match } from '../../../types/Match.type.ts';

const { Text } = Typography;

export const GameHistoryLine = React.memo(({ match, playerId }: { match: Match; playerId: string }) => {
    const isPlayerInTeamA = [match.player1A.id, match.player2A?.id].includes(playerId);

    const currentPlayer = isPlayerInTeamA
        ? match.player1A.id === playerId
            ? match.player1A
            : (match.player2A ?? match.player1A)
        : match.player1B.id === playerId
          ? match.player1B
          : (match.player2B ?? match.player1B);
    const partnerPlayer = isPlayerInTeamA
        ? match.player1A.id === playerId
            ? match.player2A
            : match.player1A
        : match.player1B.id === playerId
          ? match.player2B
          : match.player1B;
    const opponents = isPlayerInTeamA ? [match.player1B, match.player2B] : [match.player1A, match.player2A];

    const isPlayerWon = isPlayerInTeamA ? match.scoreA > match.scoreB : match.scoreA < match.scoreB;

    return (
        <List.Item>
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                    <Flex vertical>
                        <LinkPlayer player={currentPlayer} />
                        {partnerPlayer && <LinkPlayer player={partnerPlayer} />}
                    </Flex>
                </Col>
                <Col span={4}>
                    <Space size={'small'}>
                        <Tag
                            variant={'outlined'}
                            color={
                                isPlayerInTeamA
                                    ? match.scoreA > match.scoreB
                                        ? 'green'
                                        : 'red'
                                    : match.scoreA < match.scoreB
                                      ? 'green'
                                      : 'red'
                            }
                        >
                            {isPlayerInTeamA ? match.scoreA : match.scoreB}
                        </Tag>
                        <Tag
                            variant={'outlined'}
                            color={
                                isPlayerInTeamA
                                    ? match.scoreA < match.scoreB
                                        ? 'green'
                                        : 'red'
                                    : match.scoreA > match.scoreB
                                      ? 'green'
                                      : 'red'
                            }
                        >
                            {isPlayerInTeamA ? match.scoreB : match.scoreA}
                        </Tag>
                    </Space>
                </Col>
                <Col span={6}>
                    <Flex vertical>
                        {opponents[0] && <LinkPlayer player={opponents[0]} />}
                        {opponents[1] && <LinkPlayer player={opponents[1]} />}
                    </Flex>
                </Col>
                <Col span={4}>
                    <Text>
                        {isPlayerWon ? '+' : '-'}
                        {match.deltaElo}
                    </Text>
                </Col>
            </Row>
        </List.Item>
    );
});
