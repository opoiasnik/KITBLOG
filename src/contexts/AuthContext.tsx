'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signInWithGitHub, logOut } from '@/lib/firebase';

// Интерфейс для гостевого пользователя
interface GuestUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    isGuest: true;
}

// Расширенный тип пользователя
type AppUser = User | GuestUser | null;

interface AuthContextType {
    user: AppUser;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Функция для создания гостевого пользователя
const createGuestUser = (): GuestUser => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guestUser: GuestUser = {
        uid: guestId,
        displayName: 'Гость',
        email: 'guest@example.com',
        photoURL: '',
        isGuest: true,
    };
    return guestUser;
};

// Функция для проверки, является ли пользователь гостем
export const isGuestUser = (user: AppUser): user is GuestUser => {
    return user !== null && 'isGuest' in user && user.isGuest === true;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AppUser>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Проверяем localStorage на наличие гостевого пользователя
        const checkGuestUser = () => {
            const guestData = localStorage.getItem('guestUser');
            if (guestData) {
                try {
                    const guestUser = JSON.parse(guestData) as GuestUser;
                    setUser(guestUser);
                    setLoading(false);
                    return true;
                } catch {
                    localStorage.removeItem('guestUser');
                }
            }
            return false;
        };

        // Сначала проверяем гостевого пользователя
        const hasGuestUser = checkGuestUser();

        // Если нет гостевого пользователя, проверяем Firebase auth
        if (!hasGuestUser) {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    // Убираем гостевого пользователя если есть Firebase пользователь
                    localStorage.removeItem('guestUser');
                }
                setUser(firebaseUser);
                setLoading(false);
            });

            return unsubscribe;
        }
    }, []);

    const clearError = () => setError(null);

    const handleAuthError = (error: unknown) => {
        console.error('Auth error:', error);

        const authError = error as { code?: string };

        if (authError.code === 'auth/account-exists-with-different-credential') {
            setError('Аккаунт с этим email уже существует. Попробуйте войти через другой способ (Google/GitHub).');
        } else if (authError.code === 'auth/popup-closed-by-user') {
            setError('Окно авторизации было закрыто.');
        } else if (authError.code === 'auth/cancelled-popup-request') {
            setError('Авторизация была отменена.');
        } else {
            setError('Произошла ошибка при авторизации. Попробуйте еще раз.');
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            // Убираем гостевого пользователя перед входом через Google
            localStorage.removeItem('guestUser');
            await signInWithGoogle();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignInWithGitHub = async () => {
        try {
            setLoading(true);
            setError(null);
            // Убираем гостевого пользователя перед входом через GitHub
            localStorage.removeItem('guestUser');
            await signInWithGitHub();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignInAsGuest = async () => {
        try {
            setLoading(true);
            setError(null);

            const guestUser = createGuestUser();

            // Сохраняем гостевого пользователя в localStorage
            localStorage.setItem('guestUser', JSON.stringify(guestUser));

            setUser(guestUser);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            setError(null);

            // Убираем гостевого пользователя из localStorage
            localStorage.removeItem('guestUser');

            // Если это Firebase пользователь, выходим из Firebase
            if (user && !isGuestUser(user)) {
                await logOut();
            } else {
                // Для гостевого пользователя просто обнуляем состояние
                setUser(null);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        clearError,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithGitHub: handleSignInWithGitHub,
        signInAsGuest: handleSignInAsGuest,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 