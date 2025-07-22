import type {Match} from '../../types/Match.type.ts';
import type {Pagination} from '../../types/Pagination.type.ts';

export const mockMatchGetResponse: { data: Pagination<Match> } = {
    data: {
        content: [{
            id: '1',
            scoreA: 10,
            scoreB: 5,
            createdAt: new Date().toISOString(),
            player1A: {
                id: '1',
                firstname: 'John',
                lastname: 'Doe'
            },
            player2A: {
                id: '2',
                firstname: 'Jane',
                lastname: 'Doe'
            },
            player1B: {
                id: '3',
                firstname: 'Bob',
                lastname: 'Smith'
            },
            player2B: {
                id: '4',
                firstname: 'Alice',
                lastname: 'Smith'
            }
        },
            {
                id: '2',
                scoreA: 10,
                scoreB: -3,
                createdAt: new Date().toISOString(),
                player1A: {
                    id: '1',
                    firstname: 'John',
                    lastname: 'Doe'
                },
                player1B: {
                    id: '3',
                    firstname: 'Jane',
                    lastname: 'Doe'
                },
            }, {
                id: '1',
                scoreA: 10,
                scoreB: 5,
                createdAt: new Date().toISOString(),
                player1A: {
                    id: '1',
                    firstname: 'John',
                    lastname: 'Doe'
                },
                player2A: {
                    id: '3',
                    firstname: 'Bob',
                    lastname: 'Smith'
                },
                player1B: {
                    id: '2',
                    firstname: 'Jane',
                    lastname: 'Doe'
                },
                player2B: {
                    id: '4',
                    firstname: 'Alice',
                    lastname: 'Smith'
                }
            }],
        currentPage: 0,
        totalPages: 0,
        totalElements: 3,
        pageSize: 100
    }
};

export const mockMatchPostResponse = (data: Partial<Match>): { data: Match } => {
    const match: Match = {
        id: Math.random().toString(),
        scoreA: data.scoreA ?? 0,
        scoreB: data.scoreB ?? 0,
        createdAt: new Date().toISOString(),
        player1A: data.player1A ?? {id: '1', firstname: 'John', lastname: 'Doe'},
        player2A: data.player2A ?? {id: '2', firstname: 'Jane', lastname: 'Doe'},
        player1B: data.player1B ?? {id: '3', firstname: 'Bob', lastname: 'Smith'},
        player2B: data.player2B ?? {id: '4', firstname: 'Alice', lastname: 'Smith'}
    };

    return {data: match};
};