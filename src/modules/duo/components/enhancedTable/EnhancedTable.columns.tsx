import { Flex, Table } from 'antd';

import { LinkPlayer } from '../../../../components/linkPlayer/LinkPlayer.tsx';
import type { TableData } from '../../types/TableData.type';
import type { MetricConfig, MetricKey, TopBottomBoundary } from './EnhancedTable.types.ts';
import { getRankSorter, renderMetricTitle, renderMetricValue, renderRank } from './EnhancedTable.utils.tsx';

const EVEN_STAT_COLUMN_CLASSNAME = 'kicker-stat-column-even';

const getStatColumnClassName = (index: number) => (index % 2 === 1 ? EVEN_STAT_COLUMN_CLASSNAME : undefined);

export const renderMobilePlayerColumn = () => (
    <Table.Column<TableData>
        title="Joueurs"
        fixed="left"
        rowScope="row"
        width={120}
        render={(_, record) => (
            <Flex vertical>
                <LinkPlayer player={record.player1} />
                <LinkPlayer player={record.player2} />
            </Flex>
        )}
    />
);

export const renderDesktopPlayerColumns = () => (
    <>
        <Table.Column<TableData>
            title="Joueur 1"
            fixed="left"
            rowScope="row"
            width={100}
            render={(_, record) => <LinkPlayer player={record.player1} />}
        />
        <Table.Column<TableData>
            title="Joueur 2"
            fixed="left"
            rowScope="row"
            width={100}
            render={(_, record) => <LinkPlayer player={record.player2} />}
        />
    </>
);

export const renderMobileMetricColumn = (
    metric: MetricConfig,
    topBottomByMetric: Record<MetricKey, TopBottomBoundary>,
    index: number
) => (
    <Table.Column<TableData>
        key={metric.key}
        title={renderMetricTitle(metric)}
        className={getStatColumnClassName(index)}
        align="center"
        width={150}
        sorter={getRankSorter(metric)}
        defaultSortOrder={metric.key === 'winRate' ? 'ascend' : undefined}
        sortDirections={['ascend', 'descend']}
        render={(_, record) => (
            <Flex vertical gap={4}>
                {renderRank(record, metric, topBottomByMetric)}
                <span>{renderMetricValue(record, metric)}</span>
            </Flex>
        )}
    />
);

export const renderDesktopMetricColumnGroup = (
    metric: MetricConfig,
    topBottomByMetric: Record<MetricKey, TopBottomBoundary>,
    index: number
) => (
    <Table.ColumnGroup key={metric.key} title={renderMetricTitle(metric)} className={getStatColumnClassName(index)}>
        <Table.Column<TableData>
            key={metric.key + '-rank'}
            title="#"
            className={getStatColumnClassName(index)}
            align="center"
            width={64}
            sorter={getRankSorter(metric)}
            defaultSortOrder={metric.key === 'winRate' ? 'ascend' : undefined}
            sortDirections={['ascend', 'descend']}
            render={(_, record) => renderRank(record, metric, topBottomByMetric)}
        />
        <Table.Column<TableData>
            title="Valeur"
            className={getStatColumnClassName(index)}
            align="right"
            width={88}
            render={(_, record) => renderMetricValue(record, metric)}
        />
    </Table.ColumnGroup>
);
