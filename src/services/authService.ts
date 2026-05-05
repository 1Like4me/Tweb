import { STORAGE_KEYS } from '../constants/storageKeys';
import { LoginCredentials, RegisterData, User } from '../types/models';
import { readJson, writeJson } from '../utils/storage';
import api from './apiClient';

interface AuthSession {
  token: string;
  user: User;
}

interface UserApiDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  role: string;
  createdAt: string;
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

export const updateLocalUser = (updatedUser: User): void => {
  const session = getSession();
  if (session) {
    saveSession({ ...session, user: updatedUser });
  }
};

const mapCurrentUser = (dto: UserApiDto): User => {
  const normalizedRole = dto.role.toLowerCase() === 'admin' ? 'admin' : 'user';
  return {
    id: String(dto.id),
    email: dto.email || dto.username,
    password: '',
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone: dto.phoneNumber,
    profilePictureUrl: dto.profilePictureUrl,
    role: normalizedRole,
    createdAt: dto.createdAt
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post('/api/auth/login', {
      username: credentials.email,
      password: credentials.password
    });

    const { token } = response.data as { token: string; expiresAt: string };
    const meResponse = await api.get<UserApiDto>('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = mapCurrentUser(meResponse.data);
    saveSession({ token, user });
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    await api.post('/api/auth/register', {
      username: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      password: data.password
    });
    const user = await this.login({ email: data.email, password: data.password });
    return user;
  },

  logout(): void {
    saveSession(null);
  },

  getCurrentUser(): User | null {
    const session = getSession();
    if (!session) return null;
    return session.user;
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

