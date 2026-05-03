import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Grid, Table, Tooltip } from 'antd';

import { LinkPlayer } from '../../../../components/linkPlayer/LinkPlayer.tsx';
import type { TableData } from '../../types/TableData.type';
import { EnhancedTableCard, TableTitle } from './EnhancedTable.style.tsx';
import { getRankSorter, getTopBottomByMetric, metrics, renderMetricValue, renderRank } from './EnhancedTable.utils.tsx';

const { useBreakpoint } = Grid;

export const EnhancedTable = ({ data }: { data: TableData[] }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const topBottomByMetric = getTopBottomByMetric(data);

    return (
        <EnhancedTableCard>
            <Flex vertical gap={'middle'}>
                <TableTitle level={3}>Stats duos</TableTitle>
                <Table
                    size={'small'}
                    bordered
                    dataSource={data}
                    rowKey="key"
                    tableLayout={'fixed'}
                    scroll={{ x: isMobile ? 1120 : 1280 }}
                    pagination={{
                        responsive: true,
                        align: 'center',
                        showSizeChanger: false,
                        total: data.length,
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
                                width={140}
                                render={(_, record) => <LinkPlayer player={record.player1} showFullLastName />}
                            />
                            <Table.Column<TableData>
                                title="J2"
                                fixed="left"
                                width={140}
                                render={(_, record) => <LinkPlayer player={record.player2} showFullLastName />}
                            />
                        </>
                    )}
                    {metrics.map((metric) => (
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
