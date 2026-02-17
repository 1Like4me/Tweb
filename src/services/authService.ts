import { STORAGE_KEYS } from '../constants/storageKeys';
import { LoginCredentials, RegisterData, User } from '../types/models';
import { readJson, writeJson } from '../utils/storage';

interface AuthSession {
  userId: string;
  token: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllUsers = (): User[] => {
  return readJson<User[]>(STORAGE_KEYS.users, []);
};

const saveUsers = (users: User[]): void => {
  writeJson(STORAGE_KEYS.users, users);
};

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
    console.log('[authService] login', credentials.email);
    await delay(400);
    const users = getAllUsers();
    const found = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!found) {
      throw { message: 'Invalid email or password' };
    }
    const session: AuthSession = {
      userId: found.id,
      token: `mock-token-${found.id}`
    };
    saveSession(session);
    return found;
  },

  async register(data: RegisterData): Promise<User> {
    console.log('[authService] register', data.email);
    await delay(400);
    const users = getAllUsers();
    if (users.some((u) => u.email === data.email)) {
      throw { message: 'Email is already in use' };
    }
    const now = new Date().toISOString();
    const newUser: User = {
      id: `u-${Date.now()}`,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'user',
      createdAt: now
    };
    users.push(newUser);
    saveUsers(users);
    const session: AuthSession = {
      userId: newUser.id,
      token: `mock-token-${newUser.id}`
    };
    saveSession(session);
    return newUser;
  },

  logout(): void {
    console.log('[authService] logout');
    saveSession(null);
  },

  getCurrentUser(): User | null {
    const session = getSession();
    if (!session) return null;
    const users = getAllUsers();
    return users.find((u) => u.id === session.userId) ?? null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
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

