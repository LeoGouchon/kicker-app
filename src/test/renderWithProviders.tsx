import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '../context/ThemeProvider.tsx';

type RenderWithProvidersOptions = {
    route?: string;
};

export const renderWithProviders = (
    ui: ReactElement,
    options: RenderWithProvidersOptions = {}
): RenderResult & { user: UserEvent } => {
    // A fresh client per test so cached data never leaks between tests
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    const user = userEvent.setup();
    const result = render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[options.route ?? '/']}>
                <ThemeProvider>{ui}</ThemeProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );

    return { ...result, user };
};
