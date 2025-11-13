import { Button, Flex, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useParams } from 'react-router-dom';

import { type ColumnKey, useHistoryColumns } from '../../../components/HistoryColumns.tsx';
import { useGetInfiniteMatches } from '../../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../../types/Match.type.ts';

const { Text, Title } = Typography;

export const GameHistory = React.memo(() => {
    const { uuid } = useParams();

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches(
        uuid ? { playerIds: [uuid] } : {}
    );

    const visibleKeys = ['teamA', 'score', 'teamB', 'eloDelta', 'delay_from_today', 'season'] as ColumnKey[];
    const columns = useHistoryColumns({ isCondensed: true, visibleKeys });

    const winnerColumn: ColumnsType<Match> = [
        {
            key: 'winner',
            width: 10,
            onCell: (record: Match) => {
                const isPlayerInTeamA = record.player1A?.id === uuid || record.player2A?.id === uuid;
                const isTeamAWin = record.scoreA > record.scoreB;
                const isCurrentPlayerWin = (isPlayerInTeamA && isTeamAWin) || (!isPlayerInTeamA && !isTeamAWin);

                return {
                    style: {
                        backgroundColor: isCurrentPlayerWin ? 'var(--ant-color-success)' : 'var(--ant-color-error)',
                        padding: 0,
                        opacity: 0.7,
                    },
                };
            },
        },
    ];

    const allColumns = [...winnerColumn, ...columns];

    return (
        <Flex vertical gap={'small'}>
            <Title level={4} style={{ margin: 0 }}>
                Historique des parties <Text type="secondary">({data?.pages[0]?.totalElements} matchs)</Text>
            </Title>
            <Table
                loading={isLoading}
                pagination={false}
                scroll={{ x: true }}
                rowKey={(r) => r.id}
                showHeader={false}
                columns={allColumns}
                dataSource={data?.pages.flatMap((p) => p.content)}
            />
            {hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage} type={'link'}>
                        Charger plus de matchs
                    </Button>
                </div>
            )}
        </Flex>
    );
});
