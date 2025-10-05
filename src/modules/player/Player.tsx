import { Flex, List, Typography } from 'antd';
import { Navigate, useParams } from 'react-router-dom';

import { uuidRegex } from '../../routes';
import { ROUTES } from '../../routes/constant.ts';
import { EloEvolution } from './components/EloEvolution.tsx';
import { SmallCardStat, VerticalCardStats } from './Player.style.tsx';

const { Title, Text } = Typography;

const fakeData = {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    statsPerPartner: [
        {
            id: '2',
            firstname: 'Janne',
            lastname: 'Steasy',
            wins: 4,
            loses: 8,
        },
        {
            id: '4132',
            firstname: 'David',
            lastname: 'Puejadas',
            wins: 6,
            loses: 2,
        },
    ],
    statsPerOpponent: [
        {
            id: '2',
            firstname: 'Janne',
            lastname: 'Steasy',
            wins: 2,
            loses: 0,
        },
        {
            id: '4132',
            firstname: 'David',
            lastname: 'Puejadas',
            wins: 21,
            loses: 9,
        },
        {
            id: '412',
            firstname: 'John',
            lastname: 'Doe',
            wins: 1,
            loses: 0,
        },
    ],
    seasonalStats: [
        {
            year: '2024',
            quarter: '3',
            rank: 4,
            wins: 10,
            losses: 5,
            eloHistory: [
                {
                    date: '2025-01-01',
                    elo: 1500,
                },
                {
                    date: '2025-01-02',
                    elo: 1450,
                },
                {
                    date: '2025-01-05',
                    elo: 1470,
                },
                {
                    date: '2025-01-08',
                    elo: 1504,
                },
            ],
        },
        {
            year: '2024',
            quarter: '2',
            rank: 3,
            wins: 12,
            losses: 3,
            eloHistory: [
                {
                    date: '2024-04-01',
                    elo: 1520,
                },
                {
                    date: '2024-04-04',
                    elo: 1490,
                },
                {
                    date: '2024-05-05',
                    elo: 1510,
                },
                {
                    date: '2024-06-12',
                    elo: 1530,
                },
                {
                    date: '2024-06-13',
                    elo: 1530,
                },
            ],
        },
    ],
    allTimeStats: {
        wins: 130,
        losses: 35,
        rank: 2,
        eloHistory: [
            {
                date: '2025-01-01',
                elo: 1500,
            },
            {
                date: '2025-01-02',
                elo: 1450,
            },
            {
                date: '2025-01-05',
                elo: 1570,
            },
            {
                date: '2024-01-08',
                elo: 1604,
            },
        ],
    },
};

export const Player = () => {
    const { uuid } = useParams();
    const fetchPlayerData = fakeData;

    if (!uuid || !new RegExp(uuidRegex).test(uuid)) {
        return <Navigate to={ROUTES.NOT_FOUND} />;
    }

    return (
        <div>
            Player {uuid}
            <Flex gap={'middle'} wrap>
                <Flex vertical gap={'middle'} style={{ flex: 3 }}>
                    <Flex gap={'small'} align={'center'} wrap>
                        <SmallCardStat>
                            <Title level={4} style={{ margin: 0 }}>
                                Classement
                            </Title>
                            <Flex gap={'middle'}>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {fetchPlayerData.allTimeStats.rank}
                                    </Title>
                                    <Text type="secondary">Général</Text>
                                </Flex>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {fetchPlayerData.seasonalStats[fetchPlayerData.seasonalStats.length - 1].rank}
                                    </Title>
                                    <Text type="secondary">Saison</Text>
                                </Flex>
                            </Flex>
                        </SmallCardStat>
                        <SmallCardStat>
                            <Title level={4} style={{ margin: 0 }}>
                                % Victoire
                            </Title>
                            <Flex gap={'middle'}>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {(
                                            (fetchPlayerData.allTimeStats.wins /
                                                (fetchPlayerData.allTimeStats.wins +
                                                    fetchPlayerData.allTimeStats.losses)) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </Title>
                                    <Text type="secondary">Général</Text>
                                </Flex>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {(
                                            (fetchPlayerData.seasonalStats[fetchPlayerData.seasonalStats.length - 1]
                                                .wins /
                                                (fetchPlayerData.seasonalStats[fetchPlayerData.seasonalStats.length - 1]
                                                    .wins +
                                                    fetchPlayerData.seasonalStats[
                                                        fetchPlayerData.seasonalStats.length - 1
                                                    ].losses)) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </Title>
                                    <Text type="secondary">Saison</Text>
                                </Flex>
                            </Flex>
                        </SmallCardStat>
                        <SmallCardStat>
                            <Title level={4} style={{ margin: 0 }}>
                                ELO actuel
                            </Title>
                            <Flex gap={'middle'}>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {
                                            fetchPlayerData.allTimeStats.eloHistory[
                                                fetchPlayerData.allTimeStats.eloHistory.length - 1
                                            ].elo
                                        }
                                    </Title>
                                    <Text type="secondary">Général</Text>
                                </Flex>
                                <Flex vertical style={{ flex: 1 }}>
                                    <Title level={2} style={{ margin: 0 }}>
                                        {
                                            fetchPlayerData.seasonalStats[fetchPlayerData.seasonalStats.length - 1]
                                                .eloHistory[
                                                fetchPlayerData.seasonalStats[fetchPlayerData.seasonalStats.length - 1]
                                                    .eloHistory.length - 1
                                            ].elo
                                        }
                                    </Title>
                                    <Text type="secondary">Saison</Text>
                                </Flex>
                            </Flex>
                        </SmallCardStat>
                    </Flex>
                    <EloEvolution
                        seasonalStats={fetchPlayerData.seasonalStats}
                        allTimeStats={fetchPlayerData.allTimeStats}
                    />
                </Flex>
                <Flex vertical gap={'small'} style={{ flex: 1 }}>
                    <VerticalCardStats>
                        <Title level={4} style={{ margin: 0 }}>
                            Meilleurs partenaires
                        </Title>
                        <List>
                            {fetchPlayerData.statsPerPartner
                                .sort((a, b) => {
                                    const aHasEnoughMatchs = a.wins + a.loses >= 5;
                                    const bHasEnoughMatchs = b.wins + b.loses >= 5;

                                    if (aHasEnoughMatchs && bHasEnoughMatchs) {
                                        return b.wins / (b.wins + b.loses) - a.wins / (a.wins + a.loses);
                                    } else if (bHasEnoughMatchs) {
                                        return 1;
                                    } else if (aHasEnoughMatchs) {
                                        return -1;
                                    } else {
                                        return b.wins - a.wins;
                                    }
                                })
                                .map((partner) => (
                                    <List.Item key={partner.id}>
                                        <Text strong>
                                            {partner.firstname} {partner.lastname}
                                        </Text>

                                        <Text>
                                            {partner.wins} / {partner.loses}
                                        </Text>
                                    </List.Item>
                                ))}
                        </List>
                    </VerticalCardStats>
                    <VerticalCardStats>
                        <Title level={4} style={{ margin: 0 }}>
                            Adversaires
                        </Title>
                        <List>
                            {fetchPlayerData.statsPerOpponent
                                .sort((a, b) => {
                                    const aHasEnoughMatchs = a.wins + a.loses >= 5;
                                    const bHasEnoughMatchs = b.wins + b.loses >= 5;

                                    if (aHasEnoughMatchs && bHasEnoughMatchs) {
                                        return b.wins / (b.wins + b.loses) - a.wins / (a.wins + a.loses);
                                    } else if (bHasEnoughMatchs) {
                                        return 1;
                                    } else if (aHasEnoughMatchs) {
                                        return -1;
                                    } else {
                                        return b.wins - a.wins;
                                    }
                                })
                                .map((partner) => (
                                    <List.Item key={partner.id}>
                                        <Text strong>
                                            {partner.firstname} {partner.lastname}
                                        </Text>

                                        <Text>
                                            {partner.wins} / {partner.loses}
                                        </Text>
                                    </List.Item>
                                ))}
                        </List>
                    </VerticalCardStats>
                </Flex>
            </Flex>
        </div>
    );
};
