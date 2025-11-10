import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Result, Skeleton, Space, Table, Tag, Typography } from 'antd';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { FlexFullWidth } from '../../../../App.style.tsx';
import { LinkTypographyStyled } from '../../../../components/typography/Typography.style.tsx';
import { useGetGlobalStats } from '../../../../hooks/useApiEndPoint/useStats.ts';
import { ROUTES } from '../../../../routes/constant.ts';

const { Text } = Typography;

export const SeasonStats = React.memo(
    ({ year: selectedYear, quarter: selectedQuarter }: { year: number; quarter: number }) => {
        const isCurrentSeason = useCallback(() => {
            const currentYear = new Date().getFullYear();
            const currentQuarter = Math.floor((new Date().getMonth() + 1) / 3) + 1;

            console.log({ currentYear, currentQuarter, selectedYear, selectedQuarter });

            return selectedYear === currentYear && selectedQuarter === currentQuarter;
        }, [selectedYear, selectedQuarter]);

        const isAllTime = selectedYear === 0;

        const { isLoading = true, data: playerData } = useGetGlobalStats({
            year: selectedYear,
            quarter: selectedQuarter,
        });

        if (isLoading) return <Skeleton.Input />;

        if (!isLoading)
            if (playerData?.length === 0) {
                return (
                    <Result
                        status="warning"
                        title="La saison seléctionnée n'existe pas ou n'a pas encore de statistiques."
                    />
                );
            }
        return (
            <FlexFullWidth vertical>
                <Typography.Title level={2}>
                    {selectedYear === 0
                        ? 'Toutes les saisons cumulées'
                        : `Année ${selectedYear} - Trimestre ${selectedQuarter}`}
                </Typography.Title>
                <Typography.Title level={4}>Joueurs classés (min. 10 matchs)</Typography.Title>
                <Table
                    loading={isLoading}
                    size={'small'}
                    virtual
                    dataSource={playerData?.filter((player) => player.rank > 0)}
                    pagination={false}
                    columns={[
                        {
                            key: 'rank',
                            dataIndex: 'rank',
                            width: 30,
                        },
                        {
                            key: 'rankLastWeek',
                            dataIndex: 'rankLastWeek',
                            width: 60,
                            hidden: !(isCurrentSeason() || isAllTime),
                            render: (_, record) => {
                                const delta = record.rankLastWeek - record.rank;
                                return record.rankLastWeek === 0 ? (
                                    <Text style={{ color: 'var(--ant-blue)' }}>New</Text>
                                ) : delta === 0 ? (
                                    <Text type="secondary">= 0</Text>
                                ) : delta > 0 ? (
                                    <Text style={{ color: 'green' }}>
                                        <FontAwesomeIcon icon={faCaretUp} /> {delta}
                                    </Text>
                                ) : (
                                    <Text style={{ color: 'red' }}>
                                        <FontAwesomeIcon icon={faCaretDown} /> {delta * -1}
                                    </Text>
                                );
                            },
                        },
                        {
                            key: 'name',
                            title: 'Nom',
                            render: (record) => {
                                const firstname = record.firstname
                                    ? record.firstname[0].toUpperCase() + record.firstname.slice(1)
                                    : '';
                                const lastname = record.lastname
                                    ? record.lastname[0].toUpperCase() + record.lastname.slice(1)
                                    : '';
                                return (
                                    <LinkTypographyStyled>
                                        <Link to={`${ROUTES.PLAYER}/${record.id}`} style={{ all: 'unset' }}>
                                            {firstname} {lastname}
                                        </Link>
                                    </LinkTypographyStyled>
                                );
                            },
                        },
                        {
                            key: 'elo',
                            title: 'Elo',
                            width: 50,
                            align: 'center',
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.currentElo - b.currentElo,
                            dataIndex: 'currentElo',
                            render: (variable) => <Tag>{variable}</Tag>,
                        },
                        {
                            title: 'Diff 7j',
                            hidden: !(isCurrentSeason() || isAllTime),
                            sorter: (a, b) => a.currentElo - a.eloLastWeek - (b.currentElo - b.eloLastWeek),
                            render: (_, record) => {
                                const delta = record.currentElo - record.eloLastWeek;
                                return delta === 0 ? (
                                    <Text type="secondary">= 0</Text>
                                ) : delta > 0 ? (
                                    <Text style={{ color: 'green' }}>
                                        <FontAwesomeIcon icon={faCaretUp} /> {delta}
                                    </Text>
                                ) : (
                                    <Text style={{ color: 'red' }}>
                                        <FontAwesomeIcon icon={faCaretDown} /> {delta * -1}
                                    </Text>
                                );
                            },
                        },
                        {
                            key: 'count',
                            title: 'Nb. match',
                            dataIndex: 'totalMatches',
                            sorter: (a, b) => a.totalMatches - b.totalMatches,
                        },
                        {
                            key: 'win',
                            title: 'Victoire',
                            sorter: (a, b) => a.wins - b.wins,
                            dataIndex: 'wins',
                        },
                        {
                            key: 'lose',
                            title: 'Défaite',
                            sorter: (a, b) => a.losses - b.losses,
                            dataIndex: 'losses',
                        },
                        {
                            key: 'winrate',
                            title: 'Ratio',
                            dataIndex: 'winRate',
                            sorter: (a, b) => a.winRate - b.winRate,
                            render: (variable) => (variable * 100).toFixed(0) + '%',
                        },
                        {
                            key: 'lastMatches',
                            dataIndex: 'lastMatches',
                            title: 'Dernier matches',
                            hidden: !(isCurrentSeason() || isAllTime),
                            render: (variable) => (
                                <Space size={'small'}>
                                    {variable
                                        ?.slice()
                                        ?.reverse()
                                        ?.map((result: boolean, index: number) => (
                                            <Badge
                                                key={index + result.toString()}
                                                color={result ? 'green' : 'red'}
                                                style={{ opacity: (index + 1) / 5 }}
                                            />
                                        ))}
                                </Space>
                            ),
                        },
                    ]}
                />

                <Typography.Title level={4}> Joueurs non classé (-10 matchs) </Typography.Title>

                <Table
                    loading={isLoading}
                    style={{ width: '100%' }}
                    size={'small'}
                    dataSource={playerData?.filter((player) => player.rank === 0)}
                    pagination={false}
                    columns={[
                        {
                            key: 'id',
                            dataIndex: 'id',
                            width: 50,
                            render: (_, __, index) => index + 1,
                        },
                        {
                            key: 'name',
                            title: 'Nom',
                            render: (record) => {
                                const firstname = record.firstname
                                    ? record.firstname[0].toUpperCase() + record.firstname.slice(1)
                                    : '';
                                const lastname = record.lastname
                                    ? record.lastname[0].toUpperCase() + record.lastname.slice(1)
                                    : '';
                                return (
                                    <LinkTypographyStyled>
                                        <Link to={`${ROUTES.PLAYER}/${record.id}`} style={{ all: 'unset' }}>
                                            {firstname} {lastname}
                                        </Link>
                                    </LinkTypographyStyled>
                                );
                            },
                        },
                        {
                            key: 'elo',
                            title: 'Elo',
                            render: () => (
                                <Tag>
                                    <Typography.Text
                                        style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}
                                    >
                                        1500
                                    </Typography.Text>
                                </Tag>
                            ),
                            dataIndex: 'currentElo',
                        },
                        {
                            key: 'count',
                            title: 'Nb. match',
                            dataIndex: 'totalMatches',
                            defaultSortOrder: 'descend',
                            sorter: (a, b) => a.totalMatches - b.totalMatches,
                        },
                        {
                            key: 'win',
                            title: 'Victoire',
                            sorter: (a, b) => a.wins - b.wins,
                            dataIndex: 'wins',
                        },
                        {
                            key: 'lose',
                            title: 'Défaite',
                            sorter: (a, b) => a.losses - b.losses,
                            dataIndex: 'losses',
                        },
                        {
                            key: 'winrate',
                            title: 'Ratio',
                            dataIndex: 'winRate',
                            sorter: (a, b) => a.winRate - b.winRate,
                            render: (variable) => (variable * 100).toFixed(0) + '%',
                        },
                        {
                            key: 'lastMatches',
                            dataIndex: 'lastMatches',
                            title: 'Dernier matches',
                            hidden: !(isCurrentSeason() || isAllTime),
                            render: (variable) => (
                                <Space size={'small'}>
                                    {variable
                                        ?.slice()
                                        ?.reverse()
                                        ?.map((result: boolean, index: number) => (
                                            <Badge
                                                key={index + result.toString()}
                                                color={result ? 'green' : 'red'}
                                                style={{ opacity: (index + 1) / 5 }}
                                            />
                                        ))}
                                </Space>
                            ),
                        },
                    ]}
                />
            </FlexFullWidth>
        );
    },
    (prev, next) => prev.year === next.year && prev.quarter === next.quarter
);
