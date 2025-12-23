import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'lawyer' | 'admin';
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        const userWithToken = { ...userData, token };
        setUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
