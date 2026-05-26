import type { Match } from '../../types/Match.type.ts';
import type { Pagination } from '../../types/Pagination.type.ts';
import type { Player, PlayerMatchContext } from '../../types/Player.type.ts';

const mockPlayer = (player: Player, matchContext?: Partial<PlayerMatchContext>): Player & PlayerMatchContext => ({
    ...player,
    globalEloBeforeMatch: matchContext?.globalEloBeforeMatch ?? 1000,
    seasonalEloBeforeMatch: matchContext?.seasonalEloBeforeMatch ?? 1000,
});

const mockMatchContext = {
    winChanceTeamA: 0.5,
    winChanceTeamB: 0.5,
    eloWinTeamA: 10,
    eloWinTeamB: 10,
};

export const mockMatchGetResponse: { data: Pagination<Match> } = {
    data: {
        content: [
            {
                id: '1',
                scoreA: 10,
                scoreB: 5,
                createdAt: new Date().toISOString(),
                player1A: mockPlayer({
                    id: '1',
                    firstname: 'John',
                    lastname: 'Doe',
                }),
                player2A: mockPlayer({
                    id: '2',
                    firstname: 'Jane',
                    lastname: 'Doe',
                }),
                player1B: mockPlayer({
                    id: '3',
                    firstname: 'Bob',
                    lastname: 'Smith',
                }),
                player2B: mockPlayer({
                    id: '4',
                    firstname: 'Alice',
                    lastname: 'Smith',
                }),
                ...mockMatchContext,
            },
            {
                id: '2',
                scoreA: 10,
                scoreB: -3,
                createdAt: new Date().toISOString(),
                player1A: mockPlayer({
                    id: '1',
                    firstname: 'John',
                    lastname: 'Doe',
                }),
                player1B: mockPlayer({
                    id: '3',
                    firstname: 'Jane',
                    lastname: 'Doe',
                }),
                ...mockMatchContext,
            },
            {
                id: '1',
                scoreA: 10,
                scoreB: 5,
                createdAt: new Date().toISOString(),
                player1A: mockPlayer({
                    id: '1',
                    firstname: 'John',
                    lastname: 'Doe',
                }),
                player2A: mockPlayer({
                    id: '3',
                    firstname: 'Bob',
                    lastname: 'Smith',
                }),
                player1B: mockPlayer({
                    id: '2',
                    firstname: 'Jane',
                    lastname: 'Doe',
                }),
                player2B: mockPlayer({
                    id: '4',
                    firstname: 'Alice',
                    lastname: 'Smith',
                }),
                ...mockMatchContext,
            },
        ],
        currentPage: 0,
        totalPages: 0,
        totalElements: 3,
        pageSize: 100,
    },
};

export const mockMatchPostResponse = (data: Partial<Match>): { data: Match } => {
    const match: Match = {
        id: Math.random().toString(),
        scoreA: data.scoreA ?? 0,
        scoreB: data.scoreB ?? 0,
        createdAt: new Date().toISOString(),
        player1A: data.player1A ?? mockPlayer({ id: '1', firstname: 'John', lastname: 'Doe' }),
        player2A: data.player2A ?? mockPlayer({ id: '2', firstname: 'Jane', lastname: 'Doe' }),
        player1B: data.player1B ?? mockPlayer({ id: '3', firstname: 'Bob', lastname: 'Smith' }),
        player2B: data.player2B ?? mockPlayer({ id: '4', firstname: 'Alice', lastname: 'Smith' }),
        ...mockMatchContext,
    };

    return { data: match };
};
