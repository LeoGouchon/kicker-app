import { Flex, Spin, Typography } from 'antd';
import { Navigate, useParams } from 'react-router-dom';

import { useGetPlayerStats } from '../../hooks/useApiEndPoint/useStats.ts';
import { uuidRegex } from '../../routes';
import { ROUTES } from '../../routes/constant.ts';
import { EloEvolution } from './components/EloEvolution.tsx';
import { GameHistory } from './components/GameHistory.tsx';
import { OpponentList } from './components/OpponentList.tsx';
import { PartnerList } from './components/PartnerList.tsx';
import { SmallCardStat, SmallCardStatNoBorder } from './Player.style.tsx';

const { Title, Text } = Typography;

export const Player = () => {
    const { uuid } = useParams();
    const { data, isLoading: isLoadingPlayerStats } = useGetPlayerStats({ playerId: uuid! });

    if (!uuid || !new RegExp(uuidRegex).test(uuid)) {
        return <Navigate to={ROUTES.NOT_FOUND} />;
    }

    if (isLoadingPlayerStats || !data) {
        return <Spin />;
    }

    return (
        <Flex gap={'middle'} wrap>
            <Flex vertical gap={'middle'} style={{ flex: 3 }}>
                <Flex gap={'small'} align={'center'} wrap>
                    <SmallCardStatNoBorder variant={'borderless'}>
                        <Title level={2} style={{ margin: 0 }}>
                            {data.firstname} {data.lastname}
                        </Title>
                    </SmallCardStatNoBorder>
                    <SmallCardStat>
                        <Title level={4} style={{ margin: 0 }}>
                            % Victoire
                        </Title>
                        <Flex gap={'middle'}>
                            <Flex vertical style={{ flex: 1 }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {(
                                        (data.allTimeStats.wins / (data.allTimeStats.wins + data.allTimeStats.losses)) *
                                        100
                                    ).toFixed(0)}
                                    %
                                </Title>
                                <Text type="secondary">Général</Text>
                            </Flex>
                            <Flex vertical style={{ flex: 1 }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {(
                                        (data.seasonalStats[data.seasonalStats.length - 1].wins /
                                            (data.seasonalStats[data.seasonalStats.length - 1].wins +
                                                data.seasonalStats[data.seasonalStats.length - 1].losses)) *
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
                                    {data.allTimeStats.eloHistory[data.allTimeStats.eloHistory.length - 1].elo}
                                </Title>
                                <Text type="secondary">Général</Text>
                            </Flex>
                            <Flex vertical style={{ flex: 1 }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {
                                        data.seasonalStats[data.seasonalStats.length - 1].eloHistory[
                                            data.seasonalStats[data.seasonalStats.length - 1].eloHistory.length - 1
                                        ].elo
                                    }
                                </Title>
                                <Text type="secondary">Saison</Text>
                            </Flex>
                        </Flex>
                    </SmallCardStat>
                </Flex>
                <EloEvolution seasonalStats={data.seasonalStats} allTimeStats={data.allTimeStats} />
                <GameHistory />
            </Flex>
            <Flex vertical gap={'small'} style={{ flex: 1 }}>
                <PartnerList data={data.statsPerPartner} />
                <OpponentList data={data.statsPerOpponent} />
            </Flex>
        </Flex>
    );
};
