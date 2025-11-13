import { Flex, Spin, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
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

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (!uuid || !new RegExp(uuidRegex).test(uuid)) {
        return <Navigate to={ROUTES.NOT_FOUND} />;
    }

    if (isLoadingPlayerStats || !data) {
        return <Spin />;
    }

    return (
        <Flex gap={'middle'} vertical={isMobile} wrap={!isMobile}>
            <Flex vertical gap={'middle'} style={{ flex: isMobile ? 1 : 3, minWidth: isMobile ? 0 : 'none' }}>
                <Flex gap={'small'} align={isMobile ? 'start' : 'center'} wrap>
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
                                    {data.seasonalStats[0].eloHistory[data.seasonalStats[0].eloHistory.length - 1]?.elo}
                                </Title>
                                <Text type="secondary">Saison</Text>
                            </Flex>
                        </Flex>
                    </SmallCardStat>
                </Flex>
                <EloEvolution seasonalStats={data.seasonalStats} allTimeStats={data.allTimeStats} />
                <GameHistory />
            </Flex>
            <Flex vertical gap={'small'} style={{ flex: 1, minWidth: isMobile ? 0 : 'none' }}>
                <PartnerList data={data.statsPerPartner} />
                <OpponentList data={data.statsPerOpponent} />
            </Flex>
        </Flex>
    );
};
