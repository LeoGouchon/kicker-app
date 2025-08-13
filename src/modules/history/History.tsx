import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Table, Tag } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetInfiniteMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import { ROUTES } from '../../routes/constant.ts';
import type { Match } from '../../types/Match.type.ts';

export const History = () => {
    const navigate = useNavigate();
    const [dateOrder, setDateOrder] = useState<SortOrder | undefined>('descend');

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches(50, dateOrder);

    const matches: Match[] = data?.pages.flatMap((page) => page.content) ?? [];

    const getSeasonTag = (date: string) => {
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const quarter = Math.ceil((dateObject.getMonth() + 1) / 3);

        return (
            <Tag
                style={{ cursor: 'pointer', marginRight: 0 }}
                key={`${year}-${quarter}`}
                onClick={() => navigate(ROUTES.RANKING + `/${year}/${quarter}`)}
                color={quarter === 1 ? 'blue' : quarter === 2 ? 'geekblue' : quarter === 3 ? 'purple' : 'magenta'}
                icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            >{` ${year}-${quarter}`}</Tag>
        );
    };

    return (
        <>
            <Table
                loading={isLoading}
                dataSource={matches}
                pagination={false}
                size={'small'}
                rowKey={(record) => record.id}
                virtual
                onChange={(_, __, sorter) => {
                    if (!Array.isArray(sorter) && sorter?.field === 'createdAt') {
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
                                render: (date: string | null) =>
                                    date === null ? '(date inconnue)' : new Date(date).toLocaleDateString('fr-FR'),
                            },
                            {
                                title: 'Saison',
                                dataIndex: 'createdAt',
                                align: 'center',
                                width: 50,
                                render: (date: string | null) => (date === null ? '' : getSeasonTag(date)),
                            },
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
                                render: (player) => `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`,
                            },
                            {
                                title: 'Joueur 2',
                                dataIndex: 'player2A',
                                align: 'center',
                                render: (player) =>
                                    player ? `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}` : '',
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
                                    return `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}`;
                                },
                            },
                            {
                                title: 'Joueur 2',
                                dataIndex: 'player2B',
                                align: 'center',
                                render: (player) =>
                                    player ? `${player.firstname} ${player.lastname?.slice(0, 1) ?? ''}` : '',
                            },
                        ],
                    },
                ]}
            />

            {hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        Charger plus
                    </Button>
                </div>
            )}
        </>
    );
};
