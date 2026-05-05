import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { authService, updateLocalUser } from '../services/authService';
import { LoginCredentials, RegisterData, User } from '../types/models';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canSwitchRoleView: boolean;
  isViewingAsUser: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  toggleRoleView: () => void;
  updateUserContext: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    setIsViewingAsUser(false);
  }, []);

  const handleRegister = useCallback(async (data: RegisterData) => {
    const registered = await authService.register(data);
    setUser(registered);
    setIsViewingAsUser(false);
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsViewingAsUser(false);
  }, []);

  const handleToggleRoleView = useCallback(() => {
    setIsViewingAsUser((prev) => !prev);
  }, []);

  const handleUpdateUserContext = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    updateLocalUser(updatedUser);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin' && !isViewingAsUser,
      canSwitchRoleView: user?.role === 'admin',
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      isViewingAsUser,
      toggleRoleView: handleToggleRoleView,
      updateUserContext: handleUpdateUserContext
    }),
    [handleLogin, handleLogout, handleRegister, handleToggleRoleView, handleUpdateUserContext, isViewingAsUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

