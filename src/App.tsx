import './App.css';

import {BrowserRouter} from 'react-router-dom';

import {AppContent} from './AppContent.tsx';
import {UserProvider} from './context/UserContext.tsx';

export const App = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <AppContent/>
            </UserProvider>
        </BrowserRouter>
    );
};
