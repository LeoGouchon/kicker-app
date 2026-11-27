import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetGlobalStats } from '../../../../hooks/useApiEndPoint/useStats.ts';
import { renderWithProviders } from '../../../../test/renderWithProviders.tsx';
import type { GlobalStats } from '../../../../types/GlobalStats.type.ts';
import { SeasonStats } from './SeasonStats.tsx';

vi.mock('../../../../hooks/useApiEndPoint/useStats.ts', () => ({
    useGetGlobalStats: vi.fn(),
}));

const buildPlayer = (overrides: Partial<GlobalStats> = {}): GlobalStats => ({
    playerId: 'player-1',
    firstname: 'Léo',
    lastname: 'Gouchon',
    wins: 5,
    losses: 3,
    winRate: 0.625,
    totalMatches: 8,
    lastMatches: [],
    currentElo: null,
    rank: 0,
    rankLastWeek: null,
    eloLastWeek: null,
    ...overrides,
});

const newPlayer = buildPlayer({ playerId: 'new', firstname: 'Nina', lastname: 'Martin' });
const inactivePlayer = buildPlayer({
    playerId: 'inactive',
    firstname: 'Igor',
    lastname: 'Petit',
    totalMatches: 50,
    currentElo: 1620,
});
const rankedPlayer = buildPlayer({
    playerId: 'ranked',
    firstname: 'Rita',
    lastname: 'Classée',
    totalMatches: 40,
    currentElo: 1700,
    rank: 1,
    rankLastWeek: 1,
    eloLastWeek: 1690,
});

const mockStats = (data: GlobalStats[]) => {
    vi.mocked(useGetGlobalStats).mockReturnValue({ isLoading: false, data } as ReturnType<typeof useGetGlobalStats>);
};

describe('SeasonStats', () => {
    beforeEach(() => {
        vi.mocked(useGetGlobalStats).mockReset();
        // The virtual antd table needs ResizeObserver, which jsdom lacks
        vi.stubGlobal(
            'ResizeObserver',
            class {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('tags the unranked players of the all-time ranking', () => {
        mockStats([rankedPlayer, newPlayer, inactivePlayer]);

        renderWithProviders(<SeasonStats year={0} quarter={0} />);

        expect(screen.getByText('Joueurs classés (min. 10 matchs + 1 match récemment)')).toBeInTheDocument();
        expect(screen.getByText('Joueurs non classés (moins de 10 matchs ou aucun match récent)')).toBeInTheDocument();
        expect(screen.getByText('Nouveau')).toBeInTheDocument();
        expect(screen.getByText('Inactif')).toBeInTheDocument();
        expect(screen.getByText('1620')).toBeInTheDocument();
    });

    it('lists every player with a tag when nobody is ranked', () => {
        mockStats([newPlayer, inactivePlayer]);

        renderWithProviders(<SeasonStats year={0} quarter={0} />);

        expect(screen.getByText('Nina Martin', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Igor Petit', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Nouveau')).toBeInTheDocument();
        expect(screen.getByText('Inactif')).toBeInTheDocument();
    });

    it('keeps the season labels and hides tags and elo of unranked players', () => {
        mockStats([rankedPlayer, newPlayer, inactivePlayer]);

        renderWithProviders(<SeasonStats year={2026} quarter={3} />);

        expect(screen.getByText('Joueurs classés (min. 10 matchs)')).toBeInTheDocument();
        expect(screen.getByText('Joueurs non classé (-10 matchs)')).toBeInTheDocument();
        expect(screen.queryByText('Nouveau')).not.toBeInTheDocument();
        expect(screen.queryByText('Inactif')).not.toBeInTheDocument();
        expect(screen.queryByText('1620')).not.toBeInTheDocument();
    });
});
