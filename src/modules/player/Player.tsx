import { Navigate, useParams } from 'react-router-dom';

import { uuidRegex } from '../../routes';
import { ROUTES } from '../../routes/constant.ts';

const fakeData = {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    wins: 10,
    losses: 5,
    statsPerPartner: [
        {
            id: '2',
            firstname: 'Janne',
            lastname: 'Steasy',
            wins: 4,
            loses: 8,
        },
        {
            id: '4132',
            firstname: 'David',
            lastname: 'Puejadas',
            wins: 6,
            loses: 2,
        },
    ],
    statsPerOpponent: [
        {
            id: '2',
            firstname: 'Janne',
            lastname: 'Steasy',
            wins: 2,
            loses: 0,
        },
        {
            id: '4132',
            firstname: 'David',
            lastname: 'Puejadas',
            wins: 21,
            loses: 9,
        },
        {
            id: '412',
            firstname: 'John',
            lastname: 'Doe',
            wins: 1,
            loses: 0,
        },
    ],
    seasonalStats: [
        {
            year: '2024',
            quarter: '3',
            wins: 10,
            losses: 5,
            eloHistory: [
                {
                    date: '2025-01-01',
                    elo: 1500,
                },
                {
                    date: '2025-01-02',
                    elo: 1450,
                },
                {
                    date: '2025-01-05',
                    elo: 1470,
                },
                {
                    date: '2024-01-08',
                    elo: 1504,
                },
            ],
        },
    ],
};

export const Player = () => {
    const { uuid } = useParams();
    const fetchPlayerData = fakeData;

    console.log(fetchPlayerData);

    if (!uuid || !new RegExp(uuidRegex).test(uuid)) {
        return <Navigate to={ROUTES.NOT_FOUND} />;
    }

    return <div>Player {uuid}</div>;
};
