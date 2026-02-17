import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterData, User } from '../types/models';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
  }, []);

  const handleRegister = useCallback(async (data: RegisterData) => {
    const registered = await authService.register(data);
    setUser(registered);
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout
    }),
    [handleLogin, handleLogout, handleRegister, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

