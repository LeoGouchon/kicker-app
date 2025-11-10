import { Col, Flex, List, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { LinkTypographyStyled } from '../../../components/typography/Typography.style.tsx';
import { ROUTES } from '../../../routes/constant.ts';
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
                        <LinkTypographyStyled>
                            <Link to={ROUTES.PLAYER + '/' + currentPlayer.id} style={{ all: 'unset' }}>
                                {`${currentPlayer.firstname} ${currentPlayer.lastname?.[0] ?? ''}`}.
                            </Link>
                        </LinkTypographyStyled>
                        {partnerPlayer && (
                            <LinkTypographyStyled>
                                <Link to={ROUTES.PLAYER + '/' + partnerPlayer.id} style={{ all: 'unset' }}>
                                    {`${partnerPlayer.firstname} ${partnerPlayer.lastname?.[0] ?? ''}`}.
                                </Link>
                            </LinkTypographyStyled>
                        )}
                    </Flex>
                </Col>
                <Col span={4}>
                    <Space size={0}>
                        <Tag
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
                        {opponents[0] && (
                            <LinkTypographyStyled>
                                <Link to={ROUTES.PLAYER + '/' + opponents[0].id} style={{ all: 'unset' }}>
                                    {`${opponents[0].firstname} ${opponents[0].lastname?.[0] ?? ''}`}.
                                </Link>
                            </LinkTypographyStyled>
                        )}
                        {opponents[1] && (
                            <LinkTypographyStyled>
                                <Link to={ROUTES.PLAYER + '/' + opponents[1].id} style={{ all: 'unset' }}>
                                    {`${opponents[1].firstname} ${opponents[1].lastname?.[0] ?? ''}`}.
                                </Link>
                            </LinkTypographyStyled>
                        )}
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
