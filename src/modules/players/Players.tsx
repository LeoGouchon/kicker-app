import {FlexFullWidth} from "../../App.style.tsx";
import {Badge, Space, Table} from "antd";
import {useGetPlayers} from "../../hooks/useApiEndPoint/usePlayer.ts";
import type {Player} from "../../types/Player.type.ts";

export const Players = () => {
    const {isLoading, data} = useGetPlayers({page: 0, size: 100});

    const enhancedPlayer = data?.content.map((player: Player) => {
        const matchCount =  Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        const ratioWin = Math.random();

        return {
            ...player,
            win: Math.floor(matchCount * ratioWin),
            lose: Math.floor(matchCount * (1 - ratioWin)),
            eloScore: 1500 + (ratioWin > 0.5 ? -1 : 1) * 2 * (matchCount * ratioWin),
            previousMatches: [Math.random() > ratioWin, Math.random() > ratioWin, Math.random() > ratioWin, Math.random() > ratioWin, Math.random() > ratioWin]
        }
    })

    return (
        <FlexFullWidth>
            <Table
                loading={isLoading}
                style={{width: '100%'}}
                size={'small'}
                dataSource={enhancedPlayer}
                pagination={false}
                columns={[
                    {
                        key: 'name',
                        title: 'Nom',
                        render: (record) => record.firstname + ' ' + record.lastname,
                    },
                    {
                        key: 'score',
                        title: 'ELO',
                        dataIndex: 'eloScore',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.eloScore - b.eloScore,
                        render: (variable) => Math.floor(variable)
                    },
                    {
                        key: 'count',
                        title: 'Nb. match',
                        render: (record) => record.win + record.lose
                    },
                    {
                        key: 'win',
                        title: 'Victoire',
                        sorter: (a, b) => a.win - b.win,
                        dataIndex: 'win'
                    },
                    {
                        key: 'lose',
                        title: 'Défaite',
                        sorter: (a, b) => a.lose - b.lose,
                        dataIndex: 'lose'
                    },
                    {
                        key: 'winrate',
                        title: 'Ratio',
                        render: (record) => Math.floor((record.win / (record.lose + record.win)) * 100) + '%',
                    },
                    {
                        key: 'lastMatches',
                        dataIndex: 'previousMatches',
                        title: 'Dernier matches',
                        render: (variable) =>
                            <Space size={'small'}>
                                {variable.map((result: boolean, index: number) =>
                                    <Badge key={index + result.toString()} color={result ? 'green' : 'red'}

                                    />
                                        )}
                                </Space>
                    }
                ]}
            />
        </FlexFullWidth>
    )
}