import { Flex, Grid, Table, Tooltip } from 'antd';

import { LinkPlayer } from '../../../../components/linkPlayer/LinkPlayer.tsx';
import type { TableData } from '../../types/TableData.type';
import { EnhancedTableCard, MetricTitle, TableTitle } from './EnhancedTable.style.tsx';

const { useBreakpoint } = Grid;

type MetricConfig = {
    key: keyof Pick<TableData, 'matches' | 'winRate' | 'eloGainAvg' | 'eloGainTotal' | 'biggestAdvantage'>;
    title: string;
    description: string;
    isPercentage?: boolean;
};

const metrics: MetricConfig[] = [
    {
        key: 'matches',
        title: 'Matchs',
        description: 'Nombre de matchs joues.',
    },
    {
        key: 'winRate',
        title: 'Pourcentage victoire',
        description: 'Ratio victoire / matchs.',
        isPercentage: true,
    },
    {
        key: 'eloGainAvg',
        title: 'Moyenne ELO gagne',
        description: "Nombre d'ELO moyen gagne par match au classement general.",
    },
    {
        key: 'eloGainTotal',
        title: 'Total ELO gagne',
        description: "Total des points ELO gagnes au classement general sur l'ensemble des matchs.",
    },
    {
        key: 'biggestAdvantage',
        title: 'Plus grand avantage',
        description: "Delta ELO moyen entre le duo et l'adversaire.",
    },
];

export const EnhancedTable = ({ data }: { data: TableData[] }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

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
                            width={160}
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
                                    <MetricTitle>{metric.title}</MetricTitle>
                                </Tooltip>
                            }
                        >
                            <Table.Column<TableData>
                                key={metric.key + '-rank'}
                                title="Rank"
                                align="center"
                                width={64}
                                sorter={(a, b) => a[metric.key].rank - b[metric.key].rank}
                                defaultSortOrder={metric.key === 'winRate' ? 'ascend' : undefined}
                                sortDirections={['ascend', 'descend']}
                                render={(_, record) => record[metric.key].rank}
                            />
                            <Table.Column<TableData>
                                title="Valeur"
                                align="right"
                                width={88}
                                render={(_, record) => {
                                    const value = record[metric.key].value;
                                    return metric.isPercentage ? `${value}%` : value;
                                }}
                            />
                        </Table.ColumnGroup>
                    ))}
                </Table>
            </Flex>
        </EnhancedTableCard>
    );
};
