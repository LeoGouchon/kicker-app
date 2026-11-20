import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/renderWithProviders.tsx';
import type { Match } from '../../types/Match.type.ts';
import type { Player, PlayerMatchContext } from '../../types/Player.type.ts';
import { MatchLine } from './MatchLine.tsx';

const NOW = new Date('2026-11-20T12:00:00Z');

const buildPlayer = (id: string, firstname: string, lastname: string): Player & PlayerMatchContext => ({
    id,
    firstname,
    lastname,
    globalEloBeforeMatch: 1000,
    seasonalEloBeforeMatch: 1000,
});

const buildMatch = (overrides: Partial<Match> = {}): Match => ({
    id: 'match-1',
    scoreA: 10,
    scoreB: 7,
    createdAt: '2026-11-20T10:00:00Z',
    player1A: buildPlayer('p1', 'léo', 'gouchon'),
    player2A: buildPlayer('p2', 'marie', 'curie'),
    player1B: buildPlayer('p3', 'ada', 'lovelace'),
    player2B: buildPlayer('p4', 'alan', 'turing'),
    winChanceTeamA: 50,
    winChanceTeamB: 50,
    eloWinTeamA: 10,
    eloWinTeamB: 10,
    ...overrides,
});

describe('MatchLine', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows one player per team in a 1 vs 1 match', () => {
        renderWithProviders(<MatchLine match={buildMatch({ player2A: undefined, player2B: undefined })} />);

        expect(screen.getAllByRole('link')).toHaveLength(2);
    });

    // Runs after the 1 vs 1 test, to prove the DOM is cleaned up between tests
    it('shows two players per team in a 2 vs 2 match', () => {
        renderWithProviders(<MatchLine match={buildMatch()} />);

        expect(screen.getAllByRole('link')).toHaveLength(4);
    });

    it('names players with their first name and last name initial', () => {
        renderWithProviders(<MatchLine match={buildMatch()} />);

        ['Léo G.', 'Marie C.', 'Ada L.', 'Alan T.'].forEach((name) => {
            expect(screen.getByRole('link', { name })).toBeInTheDocument();
        });
    });

    it('shows the score of each team', () => {
        renderWithProviders(<MatchLine match={buildMatch()} />);

        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it.each([
        ['2026-11-20T10:00:00Z', 'Il y a 2 heures'],
        ['2026-11-20T11:59:30Z', "Il y a moins d'une minute"],
    ])('shows the time elapsed since a match created at %s', (createdAt, expected) => {
        renderWithProviders(<MatchLine match={buildMatch({ createdAt })} />);

        expect(screen.getByText(expected)).toBeInTheDocument();
    });
});
