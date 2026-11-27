type EloDeltaInput = {
    currentElo: number | null;
    eloLastWeek: number | null;
};

export const getEloDelta = ({ currentElo, eloLastWeek }: EloDeltaInput): number | null =>
    currentElo === null || eloLastWeek === null ? null : currentElo - eloLastWeek;
