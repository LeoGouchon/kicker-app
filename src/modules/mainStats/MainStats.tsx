import { Badge, Space, Table, Tag, Typography } from 'antd';

import { FlexFullWidth } from '../../App.style.tsx';
import { useGetGlobalStats } from '../../hooks/useApiEndPoint/useStats.ts';

export const MainStats = () => {
    const { isLoading, data: playerData } = useGetGlobalStats();

    return (
        <FlexFullWidth vertical>
            <Typography.Title level={2}>Statistiques globales</Typography.Title>
            <Typography.Title level={4}>Joueurs classés (min. 10 matchs)</Typography.Title>
            <Table
                loading={isLoading}
                style={{ width: '100%' }}
                size={'small'}
                dataSource={playerData?.filter((player) => player.totalMatches > 10)}
                pagination={false}
                columns={[
                    {
                        key: 'id',
                        dataIndex: 'id',
                        width: 50,
                        render: (_, __, index) => index + 1,
                    },
                    {
                        key: 'name',
                        title: 'Nom',
                        render: (record) => (record.firstname + ' ' + (record.lastname ?? '')).trim(),
                    },
                    {
                        key: 'elo',
                        title: 'Elo',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.currentElo - b.currentElo,
                        dataIndex: 'currentElo',
                        render: (variable) => <Tag>{variable}</Tag>,
                    },
                    {
                        key: 'count',
                        title: 'Nb. match',
                        dataIndex: 'totalMatches',
                        sorter: (a, b) => a.totalMatches - b.totalMatches,
                    },
                    {
                        key: 'win',
                        title: 'Victoire',
                        sorter: (a, b) => a.wins - b.wins,
                        dataIndex: 'wins',
                    },
                    {
                        key: 'lose',
                        title: 'Défaite',
                        sorter: (a, b) => a.losses - b.losses,
                        dataIndex: 'losses',
                    },
                    {
                        key: 'winrate',
                        title: 'Ratio',
                        dataIndex: 'winRate',
                        sorter: (a, b) => a.winRate - b.winRate,
                        render: (variable) => (variable * 100).toFixed(0) + '%',
                    },
                    {
                        key: 'lastMatches',
                        dataIndex: 'lastMatches',
                        title: 'Dernier matches',
                        render: (variable) => (
                            <Space size={'small'}>
                                {variable
                                    ?.slice()
                                    ?.reverse()
                                    ?.map((result: boolean, index: number) => (
                                        <Badge
                                            key={index + result.toString()}
                                            color={result ? 'green' : 'red'}
                                            style={{ opacity: (index + 1) / 5 }}
                                        />
                                    ))}
                            </Space>
                        ),
                    },
                ]}
            />

            <Typography.Title level={4}> Joueurs non classé (-10 matchs) </Typography.Title>

            <Table
                loading={isLoading}
                style={{ width: '100%' }}
                size={'small'}
                dataSource={playerData?.filter((player) => player.totalMatches <= 10)}
                pagination={false}
                columns={[
                    {
                        key: 'id',
                        dataIndex: 'id',
                        width: 50,
                        render: (_, __, index) => index + 1,
                    },
                    {
                        key: 'name',
                        title: 'Nom',
                        render: (record) => (record.firstname + ' ' + (record.lastname ?? '')).trim(),
                    },
                    {
                        key: 'elo',
                        title: 'Elo',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.currentElo - b.currentElo,
                        render: () => (
                            <Tag>
                                <Typography.Text
                                    style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}
                                >
                                    1500
                                </Typography.Text>
                            </Tag>
                        ),
                        dataIndex: 'currentElo',
                    },
                    {
                        key: 'count',
                        title: 'Nb. match',
                        dataIndex: 'totalMatches',
                        sorter: (a, b) => a.totalMatches - b.totalMatches,
                    },
                    {
                        key: 'win',
                        title: 'Victoire',
                        sorter: (a, b) => a.wins - b.wins,
                        dataIndex: 'wins',
                    },
                    {
                        key: 'lose',
                        title: 'Défaite',
                        sorter: (a, b) => a.losses - b.losses,
                        dataIndex: 'losses',
                    },
                    {
                        key: 'winrate',
                        title: 'Ratio',
                        dataIndex: 'winRate',
                        sorter: (a, b) => a.winRate - b.winRate,
                        render: (variable) => (variable * 100).toFixed(0) + '%',
                    },
                    {
                        key: 'lastMatches',
                        dataIndex: 'lastMatches',
                        title: 'Dernier matches',
                        render: (variable) => (
                            <Space size={'small'}>
                                {variable
                                    ?.slice()
                                    ?.reverse()
                                    ?.map((result: boolean, index: number) => (
                                        <Badge
                                            key={index + result.toString()}
                                            color={result ? 'green' : 'red'}
                                            style={{ opacity: (index + 1) / 5 }}
                                        />
                                    ))}
                            </Space>
                        ),
                    },
                ]}
            />
        </FlexFullWidth>
    );
};
