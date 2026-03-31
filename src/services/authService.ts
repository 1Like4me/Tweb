import { STORAGE_KEYS } from '../constants/storageKeys';
import { LoginCredentials, RegisterData, User } from '../types/models';
import { readJson, writeJson } from '../utils/storage';
import api from './apiClient';

interface AuthSession {
  token: string;
}

const saveSession = (session: AuthSession | null): void => {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
  } else {
    writeJson(STORAGE_KEYS.auth, session);
  }
};

const getSession = (): AuthSession | null => {
  return readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post('/api/auth/login', {
      username: credentials.email,
      password: credentials.password
    });

    const { token } = response.data as { token: string; expiresAt: string };
    saveSession({ token });

    const user: User = {
      id: 'current',
      email: credentials.email,
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    writeJson(STORAGE_KEYS.users, [user]);
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    await api.post('/api/auth/register', {
      username: data.email,
      password: data.password
    });

    return this.login({ email: data.email, password: data.password });
  },

  logout(): void {
    saveSession(null);
  },

  getCurrentUser(): User | null {
    const session = getSession();
    if (!session) return null;
    const users = readJson<User[]>(STORAGE_KEYS.users, []);
    return users[0] ?? null;
  },

  isAuthenticated(): boolean {
    return Boolean(getSession());
  },

  hasRole(role: 'user' | 'admin'): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    if (role === 'admin') {
      return current.role === 'admin';
    }
    return true;
  }
};

