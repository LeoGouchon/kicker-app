import { Column, type ColumnConfig } from '@ant-design/plots';
import type { Datum } from '@ant-design/plots/es/interface';
import { Flex } from 'antd';

import { useGetMatrixScore } from '../../hooks/useApiEndPoint/useMatrixScore.ts';
import type { MatrixScore } from '../../types/MatrixScore.type.ts';

export const StatHelper = () => {
    const { isLoading, data } = useGetMatrixScore();

    if (isLoading) {
        return <Flex>Chargement des données...</Flex>;
    }

    if (!data || data.length === 0) {
        return <Flex>Aucune donnée disponible</Flex>;
    }

    const chartData: Datum = data.map((p: MatrixScore) => [
        { scoreDiff: p.scoreDiff, eloDiff: p.eloDiff, delta: p.deltaWin, resultat: 'Victoire' },
        { scoreDiff: p.scoreDiff, eloDiff: p.eloDiff, delta: p.deltaLose, resultat: 'Défaite' },
    ]);

    const config: ColumnConfig = {
        data: chartData,
        isGroup: true,
        xField: 'eloDiff',
        yField: 'delta',
        seriesField: 'scoreDiff',
        groupField: 'scoreDiff',
        columnWidthRatio: 0.6,
        xAxis: {
            title: { text: 'Différence de buts (scoreDiff)' },
        },
        yAxis: {
            title: { text: 'Δ ELO' },
            label: {
                formatter: (v: string) => `${Number(v) > 0 ? '+' : ''}${v}`,
            },
        },
        tooltip: {
            formatter: (d: { scoreDiff: number; eloDiff: number; delta: number }) => ({
                name: `ELO diff ${d.eloDiff}`,
                value: `${d.delta > 0 ? '+' : ''}${d.delta}`,
            }),
        },
        legend: {
            position: 'top',
        },
        interactions: [{ type: 'element-active' }],
        meta: {
            delta: { nice: true },
        },
    };

    return (
        <Flex vertical>
            <Column {...config} />
        </Flex>
    );
};
