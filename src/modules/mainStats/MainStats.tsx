import { Badge, Space, Table } from 'antd';

import { FlexFullWidth } from '../../App.style.tsx';
import { useGetGlobalStats } from '../../hooks/useApiEndPoint/useStats.ts';

export const MainStats = () => {
    const { isLoading, data: playerData } = useGetGlobalStats();

    return (
        <FlexFullWidth>
            <Table
                loading={isLoading}
                style={{ width: '100%' }}
                size={'small'}
                dataSource={playerData}
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
                        key: 'count',
                        title: 'Nb. match',
                        dataIndex: 'totalMatches',
                    },
                    {
                        key: 'win',
                        title: 'Victoire',
                        defaultSortOrder: 'descend',
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
                                {variable?.map((result: boolean, index: number) => (
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
