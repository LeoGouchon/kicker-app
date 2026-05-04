import { Flex, Grid, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import type { TableData } from '../../types/TableData.type';
import { Filters } from './components/filters/Filters.tsx';
import {
    renderDesktopMetricColumnGroup,
    renderDesktopPlayerColumns,
    renderMobileMetricColumn,
    renderMobilePlayerColumn,
} from './EnhancedTable.columns.tsx';
import { EnhancedTableCard } from './EnhancedTable.style.tsx';
import type { MetricKey } from './EnhancedTable.types.ts';
import {
    getDefaultVisibleMetricKeys,
    getStoredFilters,
    getTopBottomByMetric,
    metrics,
    storeFilters,
} from './EnhancedTable.utils.tsx';

const { useBreakpoint } = Grid;

export const EnhancedTable = ({ data }: { data: TableData[] }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [playerIdFilter, setPlayerIdFilter] = useState<string | undefined>(() => getStoredFilters().playerIdFilter);
    const [visibleMetricKeys, setVisibleMetricKeys] = useState<MetricKey[]>(
        () => getStoredFilters().visibleMetricKeys ?? getDefaultVisibleMetricKeys()
    );
    const filteredData = useMemo(() => {
        if (!playerIdFilter) {
            return data;
        }

        return data.filter((record) => [record.player1, record.player2].some((player) => player.id === playerIdFilter));
    }, [data, playerIdFilter]);
    const visibleMetrics = useMemo(
        () => metrics.filter((metric) => visibleMetricKeys.includes(metric.key)),
        [visibleMetricKeys]
    );
    const topBottomByMetric = useMemo(() => getTopBottomByMetric(data), [data]);

    useEffect(() => {
        storeFilters({ playerIdFilter, visibleMetricKeys });
    }, [playerIdFilter, visibleMetricKeys]);

    return (
        <EnhancedTableCard>
            <Flex vertical gap={'middle'}>
                <Filters
                    data={data}
                    isMobile={isMobile}
                    playerIdFilter={playerIdFilter}
                    visibleMetricKeys={visibleMetricKeys}
                    onPlayerIdFilterChange={setPlayerIdFilter}
                    onVisibleMetricKeysChange={setVisibleMetricKeys}
                />
                <Table
                    size={'small'}
                    bordered
                    dataSource={filteredData}
                    rowKey="key"
                    tableLayout={'fixed'}
                    scroll={{ x: isMobile ? 300 : 1280 }}
                    pagination={{
                        responsive: true,
                        align: 'center',
                        showSizeChanger: false,
                        total: filteredData.length,
                        pageSize: 20,
                        showLessItems: true,
                    }}
                >
                    {isMobile ? renderMobilePlayerColumn() : renderDesktopPlayerColumns()}
                    {visibleMetrics.map((metric, index) =>
                        isMobile
                            ? renderMobileMetricColumn(metric, topBottomByMetric, index)
                            : renderDesktopMetricColumnGroup(metric, topBottomByMetric, index)
                    )}
                </Table>
            </Flex>
        </EnhancedTableCard>
    );
};
