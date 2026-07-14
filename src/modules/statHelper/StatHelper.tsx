import { Divider, Flex, Table, Tag, Typography } from 'antd';

import { TitleWithoutMargin } from '../../components/typography/Typography.style.tsx';
import { useGetMatrixScore } from '../../hooks/useApiEndPoint/useMatrixScore.ts';
import { RealResults } from './components/realResults/RealResults.tsx';
import {
    ExplanationBlock,
    ExplanationColumns,
    ExplanationList,
    ExplanationListItem,
    ExplanationSection,
    InlineFormula,
    ValueCell,
} from './StatHelper.style.tsx';

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
            <TitleWithoutMargin>Principe du classement</TitleWithoutMargin>
            <ExplanationSection vertical gap={'middle'}>
                <Flex vertical gap={'small'}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Comment fonctionne le classement ELO ?
                    </Typography.Title>
                    <Typography.Text>
                        L'ELO mesure la performance d'un joueur au baby-foot. Après chaque match, les joueurs gagnent ou
                        perdent quelques points selon le niveau des deux équipes et le score final.
                    </Typography.Text>
                </Flex>

                <ExplanationColumns>
                    <ExplanationBlock vertical gap={'small'}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Niveau des équipes
                        </Typography.Title>
                        <ExplanationList>
                            <ExplanationListItem>
                                <Typography.Text>
                                    En 2v2, le niveau d'une équipe est la moyenne de l'ELO des deux joueurs.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>En 1v1, c'est simplement l'ELO du joueur.</Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Battre une équipe mieux classée rapporte plus de points que battre une équipe moins
                                    bien classée.
                                </Typography.Text>
                            </ExplanationListItem>
                        </ExplanationList>
                    </ExplanationBlock>

                    <ExplanationBlock vertical gap={'small'}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Score réel du match
                        </Typography.Title>
                        <ExplanationList>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Une victoire large rapporte plus qu'une victoire serrée.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Une défaite serrée fait perdre moins de points qu'une défaite nette.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Le score final sert donc à ajuster l'ampleur du gain ou de la perte.
                                </Typography.Text>
                            </ExplanationListItem>
                        </ExplanationList>
                    </ExplanationBlock>
                </ExplanationColumns>

                <ExplanationColumns>
                    <ExplanationBlock vertical gap={'small'}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Variation ELO
                        </Typography.Title>
                        <ExplanationList>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Si le résultat est meilleur que prévu, l'ELO augmente.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Si le résultat est moins bon que prévu, l'ELO diminue.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    En duo, les deux joueurs de la même équipe reçoivent la même variation.
                                </Typography.Text>
                            </ExplanationListItem>
                        </ExplanationList>
                    </ExplanationBlock>

                    <ExplanationBlock vertical gap={'small'}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Global et saisonnier
                        </Typography.Title>
                        <ExplanationList>
                            <ExplanationListItem>
                                <Typography.Text>
                                    <strong>ELO global :</strong> classement historique qui prend en compte tous les
                                    matchs du joueur.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    <strong>ELO saisonnier :</strong> classement limité au trimestre du match. Q1 va de
                                    janvier à mars, Q2 d'avril à juin, Q3 de juillet à septembre, Q4 d'octobre à
                                    décembre.
                                </Typography.Text>
                            </ExplanationListItem>
                            <ExplanationListItem>
                                <Typography.Text>
                                    Si aucun ELO n'existe encore pour l'historique concerné, la valeur initiale est{' '}
                                    <InlineFormula>1500</InlineFormula>.
                                </Typography.Text>
                            </ExplanationListItem>
                        </ExplanationList>
                    </ExplanationBlock>
                </ExplanationColumns>

                <Typography.Text strong>
                    À retenir : l'ELO augmente quand un joueur ou un duo fait mieux que prévu, diminue quand il fait
                    moins bien que prévu, et l'amplitude dépend à la fois de l'écart de niveau entre les équipes et de
                    l'écart au score final.
                </Typography.Text>
            </ExplanationSection>
            <Flex vertical>
                <Flex align="center" gap={'small'} style={{ height: '100%' }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Gain de point potentiel
                    </Typography.Title>
                    <Tag variant={'outlined'} color="green">
                        Gagnant du match
                    </Tag>
                </Flex>
                <Typography.Text>
                    En fonction du <strong>score adverse</strong> (ligne) et la différence de{' '}
                    <strong>ELO Adversaire - votre ELO</strong> (colonne)
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
                    <Tag variant={'outlined'} color="red">
                        Perdant du match
                    </Tag>
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
            <TitleWithoutMargin>Statistiques appliquées</TitleWithoutMargin>
            <RealResults />
        </Flex>
    );
};
