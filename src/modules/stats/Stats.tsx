import { Table, Tag, Space, Button } from 'antd';
import type {Match} from "../../types/Match.type.ts";
import {useGetInfiniteMatches} from "../../hooks/useApiEndPoint/useMatch.ts";
import {useState} from "react";
import type {SortOrder} from "antd/es/table/interface";

export const Stats = () => {
    const [dateOrder, setDateOrder] = useState<SortOrder | undefined>("ascend");

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfiniteMatches(50, dateOrder);

    const matches: Match[] = data?.pages.flatMap(page => page.content) ?? [];

    return (
        <>
            <Table
                loading={isLoading}
                dataSource={matches}
                pagination={false}
                size={'small'}
                rowKey={(record) => record.id}
                virtual
                onChange={(
                    _, __, sorter
                ) => {
                    if (!Array.isArray(sorter) && sorter?.field === "createdAt") {
                        setDateOrder(sorter.order);
                    } else {
                        setDateOrder(null);
                    }
                }}
                columns={[
                    {
                        title: '',
                        children: [
                            {
                                title: 'Date',
                                dataIndex: 'createdAt',
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => {
                                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0; // null = très vieux
                                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                    return dateA - dateB;
                                },
                                sortOrder: dateOrder,
                                render: (date: string | null) =>
                                    date === null
                                        ? '(date inconnue)'
                                        : new Date(date).toLocaleDateString('fr-FR'),
                            }
                        ],
                    },
                    {
                        title: 'Equipe A',
                        dataIndex: 'teamA',
                        children: [
                            {
                                title: 'Joueur 1',
                                dataIndex: 'player1A',
                                align: 'center',
                                render: (player) =>
                                    `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`,
                            },
                            {
                                title: 'Joueur 2',
                                dataIndex: 'player2A',
                                align: 'center',
                                render: (player) =>
                                    player
                                        ? `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`
                                        : '',
                            },
                        ],
                    },
                    {
                        title: '',
                        children: [
                            {
                                title: 'Score',
                                align: 'center',
                                render: (match) => (
                                    <Space size={0}>
                                        <Tag color={match.scoreA > match.scoreB ? 'green' : 'red'}>{match.scoreA}</Tag>
                                        <Tag color={match.scoreA < match.scoreB ? 'green' : 'red'}>{match.scoreB}</Tag>
                                    </Space>
                                ),
                            },
                        ],
                    },
                    {
                        title: 'Equipe B',
                        dataIndex: 'teamB',
                        children: [
                            {
                                title: 'Joueur 1',
                                dataIndex: 'player1B',
                                align: 'center',
                                render: (player) => {
                                    return `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`
                                }
                            },
                            {
                                title: 'Joueur 2',
                                dataIndex: 'player2B',
                                align: 'center',
                                render: (player) =>
                                    player
                                        ? `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`
                                        : '',
                            },
                        ],
                    },
                ]}
            />

            {hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button
                        onClick={() => fetchNextPage()}
                        loading={isFetchingNextPage}
                    >
                        Charger plus
                    </Button>
                </div>
            )}
        </>
    );
};
