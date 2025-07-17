import {useGetMatches} from "../../hooks/useApiEndPoint/useMatch.ts";
import {Space, Table, Tag} from "antd";
import type {Match} from "../../types/Match.type.ts";

export const Stats = () => {
    const {isLoading, data} = useGetMatches({page: 0, size: 100});

    const matches = data?.content;

    return (
        <Table
            loading={isLoading}
            dataSource={matches}
            pagination={false}
            columns={[
                {
                    title: '',
                    children: [
                        {
                            title: 'Date',
                            dataIndex: 'createdAt',
                            defaultSortOrder: 'descend',
                            sorter: (a: Match, b: Match) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                            render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
                        }
                    ]
                },
                {
                    title: 'Equipe A',
                    dataIndex: 'teamA',
                    children: [
                        {
                            title: 'Joueur 1',
                            dataIndex: 'player1A',
                            render: (player: {
                                firstname: string,
                                lastname: string
                            }) => `${player.firstname} ${player.lastname.slice(0, 1)}`,
                        },
                        {
                            title: 'Joueur 2',
                            dataIndex: 'player2A',
                            render: (player?: {
                                firstname: string,
                                lastname: string
                            }) => player && `${player.firstname} ${player.lastname.slice(0, 1)}`,
                        },
                    ],
                },
                {
                    title: '',
                    children: [{
                        title: 'Score',
                        align: 'center',
                        render: (match: Match) => <Space size={0}><Tag>{match.scoreA}</Tag><Tag>{match.scoreB}</Tag></Space>,
                    }]
                },
                {
                    title: 'Equipe B',
                    dataIndex: 'teamB',
                    children: [
                        {
                            title: 'Joueur 1',
                            dataIndex: 'player1B',
                            render: (player: {
                                firstname: string,
                                lastname: string
                            }) => `${player.firstname} ${player.lastname.slice(0, 1)}`,
                        },
                        {
                            title: 'Joueur 2',
                            dataIndex: 'player2B',
                            render: (player?: {
                                firstname: string,
                                lastname: string
                            }) => player && `${player.firstname} ${player.lastname.slice(0, 1)}`,
                        },
                    ],
                },
            ]}
        />
    )
}