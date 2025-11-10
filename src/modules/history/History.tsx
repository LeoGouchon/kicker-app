import { Button, Table } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { useState } from 'react';

import { useHistoryColumns } from '../../components/HistoryColumns.tsx';
import { useGetInfiniteMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../types/Match.type.ts';

export const History = () => {
    const [dateOrder, setDateOrder] = useState<SortOrder>('descend');

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches({
        size: 50,
        dateOrder: dateOrder,
    });

    const matches: Match[] = data?.pages.flatMap((p) => p.content) ?? [];

    const columns = useHistoryColumns({ excludeKeys: ['delay_from_today'] });

    return (
        <>
            <Table
                loading={isLoading}
                dataSource={matches}
                pagination={false}
                rowKey={(r) => r.id}
                scroll={{ x: true }}
                columns={columns}
                onChange={(_, __, sorter) => {
                    if (!Array.isArray(sorter) && sorter?.field === 'createdAt') {
                        setDateOrder(sorter.order || 'descend');
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
