import { Divider, Flex, Table, Tag, Typography } from 'antd';

import { useGetMatrixScore } from '../../hooks/useApiEndPoint/useMatrixScore.ts';
import { RealResults } from './components/realResults/RealResults.tsx';
import { ValueCell } from './StatHelper.style.tsx';

export const StatHelper = () => {
    const { isLoading, data: rawData = [] } = useGetMatrixScore();

    const eloDiffs: number[] = Array.from(new Set(rawData.map((item) => item.eloDiff))).sort(
        (a: number, b: number) => b - a
    );
    const scoreDiffs: number[] = Array.from(new Set(rawData.map((item) => item.scoreDiff))).sort(
        (a: number, b: number) => b - a
    );

    const deltaWinMap = new Map();
    const deltaLoseMap = new Map();

    rawData.forEach((item) => {
        deltaWinMap.set(`${item.eloDiff}-${item.scoreDiff}`, item.deltaWin);
        deltaLoseMap.set(`${item.eloDiff}-${item.scoreDiff}`, item.deltaLose);
    });

    const [minWinValue, maxWinValue]: [number, number] = [
        Math.min(...rawData.map((item) => item.deltaWin)),
        Math.max(...rawData.map((item) => item.deltaWin)),
    ];
    const [minLoseValue, maxLoseValue]: [number, number] = [
        Math.min(...rawData.map((item) => item.deltaLose)),
        Math.max(...rawData.map((item) => item.deltaLose)),
    ];

    return (
        <Flex vertical gap={'large'}>
            <Typography.Title level={2} style={{ margin: 0 }}>
                Statistiques théoriques
            </Typography.Title>
            <Flex vertical>
                <Flex align="center" gap={'small'} style={{ height: '100%' }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Gain de point potentiel
                    </Typography.Title>
                    <Tag color="green">Gagnant du match</Tag>
                </Flex>
                <Typography.Text>
                    En fonction du <strong>score adverse</strong> (ligne) et la différence de{' '}
                    <strong>ELO Adversaire - votre ELO </strong>
                    (colonne)
                </Typography.Text>
                <Typography.Text type="secondary">
                    Exemple : vous avez 500 points ELO de <strong>moins</strong> que votre adversaire et vous avez gagné
                    un match <strong>10 - 0</strong>, vous gagnez donc {deltaWinMap.get('500-10')} points.
                </Typography.Text>
                <Table
                    loading={isLoading}
                    size="small"
                    pagination={false}
                    dataSource={eloDiffs.map((elo) => ({
                        key: elo,
                        eloDiff: elo,
                        ...scoreDiffs.reduce<Record<string, string | number | undefined>>((acc, score) => {
                            acc[score] = deltaWinMap.get(`${elo}-${score}`) ?? '-';
                            return acc;
                        }, {}),
                    }))}
                    scroll={{ x: 'max-content' }}
                    columns={[
                        {
                            dataIndex: 'eloDiff',
                            title: '-',
                            width: 50,
                            rowScope: 'row',
                            align: 'center',
                            onCell: () => ({
                                style: { padding: 0 },
                            }),
                        },
                        ...scoreDiffs.map((scoreDiff: number) => ({
                            dataIndex: scoreDiff.toString(),
                            title: (10 - scoreDiff).toString(),
                            align: 'center' as const,
                            render: (score: number) => (
                                <ValueCell
                                    normalizedValue={(maxWinValue - score) / (maxWinValue - minWinValue)}
                                    isGain={true}
                                    scoreDifference={10 - scoreDiff}
                                >
                                    +{score}
                                </ValueCell>
                            ),
                            onCell: () => ({
                                style: { padding: 0 },
                            }),
                        })),
                    ]}
                />
            </Flex>
            <Flex vertical>
                <Flex align="center" gap={'small'} style={{ height: '100%' }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Perte de point potentiel
                    </Typography.Title>
                    <Tag color="red">Perdant du match</Tag>
                </Flex>
                <Typography.Text>
                    En fonction de <strong>votre score</strong> (ligne) et la différence de{' '}
                    <strong>ELO Adversaire - votre ELO </strong>
                    (colonne)
                </Typography.Text>
                <Table
                    loading={isLoading}
                    size="small"
                    pagination={false}
                    dataSource={eloDiffs.map((elo) => ({
                        key: elo,
                        eloDiff: elo,
                        ...scoreDiffs.reduce<Record<string, string | number | undefined>>((acc, score) => {
                            acc[score] = deltaLoseMap.get(`${elo}-${score}`) ?? '-';
                            return acc;
                        }, {}),
                    }))}
                    scroll={{ x: 'max-content' }}
                    columns={[
                        {
                            dataIndex: 'eloDiff',
                            title: '-',
                            width: 50,
                            rowScope: 'row',
                            align: 'center',
                            onCell: () => ({
                                style: { padding: 0 },
                            }),
                        },
                        ...scoreDiffs.map((scoreDiff: number) => ({
                            dataIndex: scoreDiff.toString(),
                            title: (10 - scoreDiff).toString(),
                            align: 'center' as const,
                            render: (score: number) => (
                                <ValueCell
                                    normalizedValue={(maxLoseValue - score) / (maxLoseValue - minLoseValue)}
                                    isGain={false}
                                    scoreDifference={10 - scoreDiff}
                                >
                                    {score}
                                </ValueCell>
                            ),
                            onCell: () => ({
                                style: { padding: 0 },
                            }),
                        })),
                    ]}
                />
            </Flex>
            <Divider />
            <Typography.Title level={2} style={{ margin: 0 }}>
                Statistiques appliquées
            </Typography.Title>
            <RealResults />
        </Flex>
    );
};
