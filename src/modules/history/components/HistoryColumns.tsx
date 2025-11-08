import { faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Dropdown, Flex, Grid, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LinkTypographyStyled } from '../../../components/typography/Typography.style.tsx';
import { UserContext } from '../../../context/UserContext.tsx';
import { useDeleteMatch } from '../../../hooks/useApiEndPoint/useMatch.ts';
import { ROUTES } from '../../../routes/constant.ts';
import type { Match } from '../../../types/Match.type.ts';

const { useBreakpoint } = Grid;
const DELETE_MATCH_DAYS = 7;

export const useHistoryColumns = (): ColumnsType<Match> => {
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
                {`${year}-${quarter}`}
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
                            {r.player2A ? `${r.player2A.firstname} ${r.player2A.lastname?.[0] ?? ''}` : ''}.
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
                            {r.player2B ? `${r.player2B.firstname} ${r.player2B.lastname?.[0] ?? ''}` : ''}.
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
            key: 'player1A',
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
            key: 'player2A',
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
            key: 'player1B',
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
            key: 'player2B',
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

    return useMemo(
        () => [
            ...(isMobile ? [teamACompact] : teamADetails),
            scoreColumn,
            ...(isMobile ? [teamBCompact] : teamBDetails),
            {
                title: 'Date',
                dataIndex: 'createdAt',
                key: 'date',
                align: 'right' as const,
                sorter: true,
                render: (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '(date inconnue)'),
            },
            {
                title: 'Saison',
                dataIndex: 'createdAt',
                key: 'season',
                align: 'left' as const,
                render: (d: string | null) => (d ? getSeasonTag(d) : ''),
            },
            {
                title: 'Elo global / saisonnier',
                key: 'eloDelta',
                align: 'center' as const,
                render: (record: Match) => (
                    <Flex justify="center">
                        <Tag>±{record.deltaElo}</Tag>
                        <Tag>±{record.deltaEloSeasonal}</Tag>
                    </Flex>
                ),
            },
            actionsColumn,
        ],
        [isMobile, user]
    );
};
