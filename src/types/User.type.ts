export type UserType = {
    id: string;
    email: string;
    admin: boolean;
    player?: {
        id: string;
        firstname: string;
        lastname?: string;
        playerTeams: {
            id: {
                playerId: string;
                teamId: string;
            };
            team: {
                id: string;
                name: string;
                shortname: string;
                kicker: boolean;
                squash: boolean;
            };
        }[];
    };
};
