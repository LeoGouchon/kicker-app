import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Grid, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { LinkPlayer } from '../../../../components/linkPlayer/LinkPlayer.tsx';
import type { TableData } from '../../types/TableData.type';
import { Filters } from './components/filters/Filters.tsx';
import { EnhancedTableCard, TableTitle } from './EnhancedTable.style.tsx';
import {
    getRankSorter,
    getTopBottomByMetric,
    type MetricKey,
    metrics,
    renderMetricValue,
    renderRank,
} from './EnhancedTable.utils.tsx';

const { useBreakpoint } = Grid;
const STORAGE_KEY = 'kicker.duo.enhancedTable.filters';

type StoredFilters = {
    playerIdFilter?: string;
    visibleMetricKeys?: MetricKey[];
};

const getDefaultVisibleMetricKeys = () => metrics.map((metric) => metric.key);

const isMetricKey = (value: unknown): value is MetricKey => {
    return typeof value === 'string' && metrics.some((metric) => metric.key === value);
};

const getStoredFilters = (): StoredFilters => {
    if (typeof window === 'undefined') {
        return {};
    }

    const storedFilters = window.localStorage.getItem(STORAGE_KEY);

    if (!storedFilters) {
        return {};
    }

    try {
        const parsedFilters: unknown = JSON.parse(storedFilters);

        if (!parsedFilters || typeof parsedFilters !== 'object') {
            return {};
        }

        const filters = parsedFilters as Record<string, unknown>;
        const visibleMetricKeys = Array.isArray(filters.visibleMetricKeys)
            ? filters.visibleMetricKeys.filter(isMetricKey)
            : undefined;

        return {
            playerIdFilter: typeof filters.playerIdFilter === 'string' ? filters.playerIdFilter : undefined,
            visibleMetricKeys: visibleMetricKeys?.length ? visibleMetricKeys : undefined,
        };
    } catch {
        return {};
    }
};

const storeFilters = (filters: StoredFilters) => {
    if (typeof globalThis === 'undefined') {
        return;
    }

    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
};

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
                <Flex justify="space-between" align={isMobile ? 'stretch' : 'center'} vertical={isMobile} gap="small">
                    <TableTitle level={3}>Stats duos</TableTitle>
                    <Filters
                        data={data}
                        isMobile={isMobile}
                        playerIdFilter={playerIdFilter}
                        visibleMetricKeys={visibleMetricKeys}
                        onPlayerIdFilterChange={setPlayerIdFilter}
                        onVisibleMetricKeysChange={setVisibleMetricKeys}
                    />
                </Flex>
                <Table
                    size={'small'}
                    bordered
                    dataSource={filteredData}
                    rowKey="key"
                    tableLayout={'fixed'}
                    scroll={{ x: isMobile ? 1120 : 1280 }}
                    pagination={{
                        responsive: true,
                        align: 'center',
                        showSizeChanger: false,
                        total: filteredData.length,
                        pageSize: 20,
                        showLessItems: true,
                    }}
                >
                    {isMobile ? (
                        <Table.Column<TableData>
                            title="Joueurs"
                            fixed="left"
                            width={100}
                            render={(_, record) => (
                                <Flex vertical>
                                    <LinkPlayer player={record.player1} showFullLastName />
                                    <LinkPlayer player={record.player2} showFullLastName />
                                </Flex>
                            )}
                        />
                    ) : (
                        <>
                            <Table.Column<TableData>
                                title="J1"
                                fixed="left"
                                width={100}
                                render={(_, record) => <LinkPlayer player={record.player1} showFullLastName />}
                            />
                            <Table.Column<TableData>
                                title="J2"
                                fixed="left"
                                width={100}
                                render={(_, record) => <LinkPlayer player={record.player2} showFullLastName />}
                            />
                        </>
                    )}
                    {visibleMetrics.map((metric) => (
                        <Table.ColumnGroup
                            key={metric.key}
                            title={
                                <Tooltip title={metric.description}>
                                    <>
                                        {metric.title} <FontAwesomeIcon icon={faInfoCircle} />
                                    </>
                                </Tooltip>
                            }
                        >
                            <Table.Column<TableData>
                                key={metric.key + '-rank'}
                                title="#"
                                align="center"
                                width={isMobile ? 48 : 64}
                                sorter={getRankSorter(metric)}
                                defaultSortOrder={metric.key === 'winRate' ? 'ascend' : undefined}
                                sortDirections={['ascend', 'descend']}
                                render={(_, record) => renderRank(record, metric, topBottomByMetric)}
                            />
                            <Table.Column<TableData>
                                title="Valeur"
                                align="right"
                                width={88}
                                render={(_, record) => renderMetricValue(record, metric)}
                            />
                        </Table.ColumnGroup>
                    ))}
                </Table>
            </Flex>
        </EnhancedTableCard>
    );
};
