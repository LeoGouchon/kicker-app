import { Button, Table } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { useState } from 'react';

import { useGetInfiniteMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../types/Match.type.ts';
import { useHistoryColumns } from './components/HistoryColumns.tsx';

export const History = () => {
    const [dateOrder, setDateOrder] = useState<SortOrder | undefined>('descend');

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches(50, dateOrder);

    const matches: Match[] = data?.pages.flatMap((p) => p.content) ?? [];

    const columns = useHistoryColumns();
    const lockedKeys = ['player1A', 'player2A', 'score', 'player1B', 'player2B'];

    const visibleKeys = columns.map((c) => c.key).filter(Boolean) as string[];
    const filteredColumns = columns.filter(
        (column) => lockedKeys.includes(column.key as string) || visibleKeys.includes(column.key as string)
    );

    return (
        <>
            <Table
                loading={isLoading}
                dataSource={matches}
                pagination={false}
                rowKey={(r) => r.id}
                scroll={{ x: true }}
                columns={filteredColumns}
                onChange={(_, __, sorter) => {
                    if (!Array.isArray(sorter) && sorter?.field === 'createdAt') {
                        setDateOrder(sorter.order);
                    } else {
                        setDateOrder(null);
                    }
                }}
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
