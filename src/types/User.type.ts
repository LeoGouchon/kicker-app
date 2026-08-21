export const UserRole = {
    Admin: 'ADMIN',
    Moderator: 'MODERATOR',
    User: 'USER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type UserType = {
    id: string;
    email: string;
    role: UserRole;
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
