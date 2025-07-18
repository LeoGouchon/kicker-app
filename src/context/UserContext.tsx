import {createContext, type ReactNode, useEffect, useState, useMemo} from "react";
import type {UserType} from "../types/User.type.ts";

interface UserContextType {
    user?: UserType;
    setUser: (newUser?: UserType) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: undefined,
    setUser: () => {}
});

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const value: UserContextType = useMemo(() => ({
        user,
        setUser,
    }), [user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}