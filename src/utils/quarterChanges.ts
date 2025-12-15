import type { EloHistory } from '../modules/player/components/Elo/SeasonedElo.tsx';

export const getQuarterChanges = (eloHistory: EloHistory[]) => {
    const dates = [...eloHistory].map((e) => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime());

    const markers: Date[] = [];
    let lastQuarter: number | null = null;

    for (const date of dates) {
        const quarter = Math.floor(date.getMonth() / 3);
        if (lastQuarter !== null && quarter !== lastQuarter) {
            markers.push(date);
        }
        lastQuarter = quarter;
    }

    return markers;
};

export const getQuarterLabel = (date: Date) => {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `${date.getFullYear()}-${quarter}`;
};
