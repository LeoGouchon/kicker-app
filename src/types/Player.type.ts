export type Player = {
    id: string;
    firstname: string;
    lastname: string;
};

export type PlayerMatchContext = {
    globalEloBeforeMatch: number;
    seasonalEloBeforeMatch: number;
};
