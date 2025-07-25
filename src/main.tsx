import './index.css';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from './App.tsx';
import {ThemeProvider} from './context/ThemeProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <App/>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
