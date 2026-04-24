import { Booking, User } from '../types/models';
import api from './apiClient';
import { bookingService } from './bookingService';

interface UserApiDto {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

const mapUser = (dto: UserApiDto): User => {
  const normalizedRole = dto.role.toLowerCase() === 'admin' ? 'admin' : 'user';
  return {
    id: String(dto.id),
    email: dto.username.trim().toLowerCase(),
    password: '',
    firstName: normalizedRole === 'admin' ? 'Admin' : 'User',
    lastName: 'Account',
    phone: '',
    role: normalizedRole,
    createdAt: dto.createdAt
  };
};

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<UserApiDto[]>('/api/users');
    return response.data.map(mapUser);
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<UserApiDto>(`/api/users/${id}`);
    return mapUser(response.data);
  },

  async updateUser(
    id: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>
  ): Promise<User> {
    const current = await this.getUserById(id);
    await api.put(`/api/users/${id}`, {
      username: userData.email ?? current.email
    });
    return this.getUserById(id);
  },

  async changeUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    console.log('[userService] changeUserRole', id, role);
    await delay(350);
    return this.updateUser(id, { role });
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    return bookingService.getBookings(userId);
  }
};

