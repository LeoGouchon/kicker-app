import './App.css'
import {BrowserRouter} from "react-router-dom";
import {AppContent} from "./AppContent.tsx";

export const App = () => {
    return (
        <BrowserRouter>
           <AppContent />
        </BrowserRouter>
    )
}
