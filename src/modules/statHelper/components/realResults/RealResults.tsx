import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Popover, Table, Tag, Typography } from 'antd';
import React from 'react';

import { useGetMatrixScoreRealResults } from '../../../../hooks/useApiEndPoint/useMatrixScore.ts';
import type { MatrixScoreRealResult } from '../../../../types/MatrixScore.type.ts';
import { ValueCell } from '../../StatHelper.style.tsx';

const DELTA_ELO_STEP = 100;
const MAX_ELO_DIFF = 600;
const MIN_ELO_DIFF = -600;

export const RealResults = React.memo(() => {
    const { isLoading, data } = useGetMatrixScoreRealResults();

    const scoreDiffs = Array.from({ length: 20 }, (_, i) => i - 10); // [-10..9]

    // Group data per delta Elo / score
    const groupedData: Record<string, number> =
        data?.reduce(
            (acc, item: MatrixScoreRealResult) => {
                const bucket = Math.floor(item.eloDelta / DELTA_ELO_STEP) * DELTA_ELO_STEP;
                const key = `${bucket}_${item.score}`;
                acc[key] = (acc[key] ?? 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        ) ?? {};

    // Transform to array
    const groupedArray: { bucket: number; score: number; count: number }[] = Object.entries(groupedData).map(
        ([key, count]) => {
            const [bucketStr, scoreStr] = key.split('_');
            return {
                bucket: parseInt(bucketStr, 10),
                score: parseInt(scoreStr, 10),
                count,
            };
        }
    );

    // Transform data to have one line per delta ELO
    const pivotedData = groupedArray.reduce<Record<string, Record<string, number>>>((acc, { bucket, score, count }) => {
        const bucketKey = bucket.toString();
        if (!acc[bucketKey]) {
            acc[bucketKey] = { bucket };
        }
        acc[bucketKey][score] = count;
        return acc;
    }, {});

    // Generate all buckets between -600 and 600
    const bucketsRange = Array.from(
        { length: Math.ceil((MAX_ELO_DIFF - MIN_ELO_DIFF) / DELTA_ELO_STEP) + 1 },
        (_, i) => MIN_ELO_DIFF + i * DELTA_ELO_STEP
    ).reverse();

    // Create data for visual Table
    const tableData = bucketsRange.map((bucket) => {
        const existing = pivotedData[bucket] ?? {};

        const row: Record<string, number> = {
            key: bucket,
            eloDiff: bucket,
        };

        for (const score of scoreDiffs) {
            row[score] = existing[score] ?? 0;
        }

        return row;
    });
    const maxCount = Math.max(...groupedArray.map((row) => row.count));
    const minCount = Math.min(...groupedArray.map((row) => row.count));

    console.log(groupedArray, tableData, maxCount, minCount);

    return (
        <Flex vertical>
            <Flex align="center" gap={'small'} style={{ height: '100%' }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Nombre de matchs saisonniers par Δ Elo et score{' '}
                </Typography.Title>
            </Flex>
            <Typography.Text>
                En fonction du <strong>score de l'équiper perdante</strong> (ligne) et la différence de{' '}
                <strong>ELO Perdant - ELO Gagnant </strong>
                (colonne)
            </Typography.Text>
            <Typography.Text type="secondary">
                <Popover
                    placement="right"
                    styles={{
                        root: {
                            width: '300px',
                        },
                    }}
                    content={
                        <Typography.Text>
                            Plus le Δ Elo est <strong>négatif</strong>, plus il indique que l'équipe victorieuse était
                            statistiquement
                            <strong> favorite</strong>. À l’inverse, dans le <strong>haut du tableau</strong>, un Δ Elo{' '}
                            <strong>positif</strong> traduit une <strong>performance remarquable</strong> : l’équipe
                            gagnante s’est imposée alors qu’elle était donnée perdante.
                        </Typography.Text>
                    }
                >
                    <Tag color="default" icon={<FontAwesomeIcon icon={faQuestion} />}>
                        {' '}
                        J'ai pas compriiiis
                    </Tag>
                </Popover>
                Un Δ ELO négatif indique qu’une équipe victorieuse était statistiquement favorite.
            </Typography.Text>
            <Table
                loading={isLoading}
                size="small"
                pagination={false}
                dataSource={tableData}
                scroll={{ x: 'max-content' }}
                columns={[
                    {
                        dataIndex: 'eloDiff',
                        title: 'Δ Elo',
                        width: 50,
                        align: 'center',
                        onCell: () => ({ style: { padding: 0 } }),
                    },
                    ...scoreDiffs.map((scoreDiff: number) => ({
                        dataIndex: scoreDiff.toString(),
                        title: scoreDiff.toString(),
                        align: 'center' as const,
                        render: (score?: number) => (
                            <ValueCell
                                normalizedValue={score !== undefined ? (maxCount - score) / (maxCount - minCount) : 0}
                                isGain={true}
                                scoreDifference={scoreDiff}
                            >
                                {score ?? '-'}
                            </ValueCell>
                        ),
                        onCell: () => ({ style: { padding: 0 } }),
                    })),
                ]}
            />
        </Flex>
    );
});
