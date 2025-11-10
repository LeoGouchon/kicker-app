import { faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Dropdown, Flex, Grid, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../context/UserContext.tsx';
import { useDeleteMatch } from '../hooks/useApiEndPoint/useMatch.ts';
import { ROUTES } from '../routes/constant.ts';
import type { Match } from '../types/Match.type.ts';
import { LinkTypographyStyled } from './typography/Typography.style.tsx';

const { useBreakpoint } = Grid;
const DELETE_MATCH_DAYS = 7;

export type ColumnKey =
    | 'teamA'
    | 'teamA_J1'
    | 'teamA_J2'
    | 'score'
    | 'teamB'
    | 'teamB_J1'
    | 'teamB_J2'
    | 'date'
    | 'delay_from_today'
    | 'season'
    | 'eloDelta'
    | 'actions';

type HistoryColumnsOptions = {
    isCondensed?: boolean;
    visibleKeys?: ColumnKey[];
    excludeKeys?: ColumnKey[];
};

export const useHistoryColumns = ({
    isCondensed = false,
    visibleKeys,
    excludeKeys = [],
}: HistoryColumnsOptions): ColumnsType<Match> => {
    const navigate = useNavigate();
    const { modal, message } = App.useApp();

    const { user } = useContext(UserContext);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const deleteMatch = useDeleteMatch();

    const handleDelete = (id: string) => {
        modal.confirm({
            title: 'Supprimer le match',
            content: 'Voulez-vous vraiment supprimer ce match ?',
            okText: 'Oui',
            cancelText: 'Non',
            onOk: () =>
                deleteMatch.mutate(id, {
                    onSuccess: () => message.success('Match supprimé'),
                    onError: () => message.error('Erreur lors de la suppression du match'),
                }),
        });
    };

    const getSeasonTag = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const quarter = Math.ceil((d.getMonth() + 1) / 3);
        const colors = ['blue', 'geekblue', 'purple', 'magenta'];
        return (
            <Tag
                style={{ cursor: 'pointer', marginRight: 0 }}
                color={colors[quarter - 1]}
                onClick={() => navigate(`${ROUTES.RANKING}/${year}/${quarter}`)}
                icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            >
                {` ${year}-${quarter}`}
            </Tag>
        );
    };

    const teamACompact = {
        title: 'Équipe A',
        key: 'teamA',
        render: (r: Match) => (
            <Flex vertical>
                <LinkTypographyStyled>
                    <Link to={ROUTES.PLAYER + '/' + r.player1A.id} style={{ all: 'unset' }}>
                        {r.player1A ? `${r.player1A.firstname} ${r.player1A.lastname?.[0] ?? ''}` : ''}.
                    </Link>
                </LinkTypographyStyled>
                {r.player2A && (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + r.player2A.id} style={{ all: 'unset' }}>
                            {`${r.player2A.firstname} ${r.player2A.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                )}
            </Flex>
        ),
    };

    const teamBCompact = {
        title: 'Équipe B',
        key: 'teamB',
        render: (r: Match) => (
            <Flex vertical>
                <LinkTypographyStyled>
                    <Link to={ROUTES.PLAYER + '/' + r.player1B.id} style={{ all: 'unset' }}>
                        {r.player1B ? `${r.player1B.firstname} ${r.player1B.lastname?.[0] ?? ''}` : ''}.
                    </Link>
                </LinkTypographyStyled>
                {r.player2B && (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + r.player2B.id} style={{ all: 'unset' }}>
                            {`${r.player2B.firstname} ${r.player2B.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                )}
            </Flex>
        ),
    };

    const teamADetails = [
        {
            title: 'Équipe A - J1',
            dataIndex: 'player1A',
            key: 'teamA_J1',
            width: 140,
            align: 'right' as const,
            render: (p: Match['player1A']) =>
                p ? (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + p.id} style={{ all: 'unset' }}>
                            {`${p.firstname} ${p.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                ) : (
                    ''
                ),
        },
        {
            title: 'Équipe A - J2',
            dataIndex: 'player2A',
            key: 'teamA_J2',
            width: 140,
            align: 'right' as const,
            render: (p: Match['player2A']) =>
                p ? (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + p.id} style={{ all: 'unset' }}>
                            {`${p.firstname} ${p.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                ) : (
                    ''
                ),
        },
    ];

    const teamBDetails = [
        {
            title: 'Équipe B - J1',
            dataIndex: 'player1B',
            key: 'teamB_J1',
            width: 140,
            align: 'left' as const,
            render: (p: Match['player1B']) =>
                p ? (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + p.id} style={{ all: 'unset' }}>
                            {`${p.firstname} ${p.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                ) : (
                    ''
                ),
        },
        {
            title: 'Équipe B - J2',
            dataIndex: 'player2B',
            key: 'teamB_J2',
            width: 140,
            align: 'left' as const,
            render: (p: Match['player2B']) =>
                p ? (
                    <LinkTypographyStyled>
                        <Link to={ROUTES.PLAYER + '/' + p.id} style={{ all: 'unset' }}>
                            {`${p.firstname} ${p.lastname?.[0] ?? ''}`}.
                        </Link>
                    </LinkTypographyStyled>
                ) : (
                    ''
                ),
        },
    ];

    const scoreColumn = {
        title: 'Score',
        key: 'score',
        align: 'center' as const,
        width: 100,
        render: (m: Match) => (
            <Space size={0}>
                <Tag color={m.scoreA > m.scoreB ? 'green' : 'red'}>{m.scoreA}</Tag>
                <Tag color={m.scoreA < m.scoreB ? 'green' : 'red'}>{m.scoreB}</Tag>
            </Space>
        ),
    };

    const dateColumn = {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'date',
        align: 'right' as const,
        sorter: true,
        render: (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '(date inconnue)'),
    };

    const delay_from_today = {
        title: '',
        dataIndex: 'createdAt',
        key: 'delay_from_today',
        align: 'right' as const,
        render: (d: string | null) => {
            const now = new Date().getTime();
            const createdAt = d ? new Date(d).getTime() : 0;
            const diffTime = Math.abs(now - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return d ? `${diffDays} ${diffDays > 1 ? 'jours' : 'jour'}` : '(date inconnue)';
        },
    };

    const seasonColumn = {
        title: 'Saison',
        dataIndex: 'createdAt',
        key: 'season',
        align: 'left' as const,
        render: (d: string | null) => (d ? getSeasonTag(d) : ''),
    };

    const eloColumn = {
        title: 'Elo global / saisonnier',
        key: 'eloDelta',
        align: 'center' as const,
        render: (record: Match) => (
            <Flex justify="center">
                <Tag>±{record.deltaElo}</Tag>
                <Tag>±{record.deltaEloSeasonal}</Tag>
            </Flex>
        ),
    };

    const actionsColumn = {
        key: 'actions',
        align: 'right' as const,
        width: 100,
        render: (record: Match) => (
            <Dropdown.Button
                size="small"
                menu={{
                    items: [
                        {
                            key: 'delete',
                            label: 'Supprimer',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            danger: true,
                            disabled:
                                !user?.admin ||
                                new Date(Date.now() - DELETE_MATCH_DAYS * 24 * 60 * 60 * 1000) >
                                    new Date(record.createdAt),
                            onClick: () => handleDelete(record.id),
                        },
                    ],
                }}
            >
                <Space>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    Détails
                </Space>
            </Dropdown.Button>
        ),
    };

    const allColumns: ColumnsType<Match> = [
        ...(isMobile || isCondensed ? [teamACompact] : teamADetails),
        scoreColumn,
        ...(isMobile || isCondensed ? [teamBCompact] : teamBDetails),
        dateColumn,
        delay_from_today,
        seasonColumn,
        eloColumn,
        actionsColumn,
    ];

    let finalColumns: ColumnsType<Match>;

    if (visibleKeys && visibleKeys.length > 0) {
        const order = new Map(visibleKeys.map((k, i) => [k, i]));

        finalColumns = allColumns
            .filter((column) => {
                const key = column.key as ColumnKey | undefined;
                return key && order.has(key) && !excludeKeys.includes(key);
            })
            .sort((a, b) => {
                return order.get(a.key as ColumnKey)! - order.get(b.key as ColumnKey)!;
            });
    } else {
        finalColumns = allColumns.filter((c) => {
            const key = c.key as ColumnKey | undefined;
            return key && !excludeKeys.includes(key);
        });
    }

    return useMemo(() => finalColumns, [isMobile, user, isCondensed, visibleKeys?.join(), excludeKeys.join()]);
};
