import { Booking, User } from '../types/models';
import api from './apiClient';
import { bookingService } from './bookingService';

interface UserApiDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  isEmailVerified?: boolean;
  role: string;
  createdAt: string;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mapUser = (dto: UserApiDto): User => {
  const normalizedRole = dto.role.toLowerCase() === 'admin' ? 'admin' : 'user';
  return {
    id: String(dto.id),
    email: dto.email || dto.username,
    password: '',
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone: dto.phoneNumber,
    profilePictureUrl: dto.profilePictureUrl,
    isEmailVerified: dto.isEmailVerified,
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
      username: current.email, // Kept for backwards compatibility
      email: userData.email ?? current.email,
      firstName: userData.firstName ?? current.firstName,
      lastName: userData.lastName ?? current.lastName,
      phoneNumber: userData.phone ?? current.phone,
      profilePictureUrl: userData.profilePictureUrl ?? current.profilePictureUrl
    });
    return this.getUserById(id);
  },

  async uploadProfilePicture(id: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>(`/api/users/${id}/upload-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async sendVerificationEmail(id: string): Promise<{ message: string; mockCode?: string }> {
    const response = await api.post<{ message: string; mockCode?: string }>(`/api/users/${id}/send-verification`);
    return response.data;
  },

  async verifyEmail(id: string, code: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/api/users/${id}/verify-email`, { code });
    return response.data;
  },

  async changeUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    const apiRole = role.charAt(0).toUpperCase() + role.slice(1);
    await api.put(`/api/users/${id}/role`, { role: apiRole });
    return this.getUserById(id);
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    return bookingService.getBookings(userId);
  }
};

