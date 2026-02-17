import { STORAGE_KEYS } from '../constants/storageKeys';
import { Booking, User } from '../types/models';
import { readJson, writeJson } from '../utils/storage';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllUsers = (): User[] => readJson<User[]>(STORAGE_KEYS.users, []);
const saveUsers = (users: User[]): void => writeJson(STORAGE_KEYS.users, users);
const getAllBookings = (): Booking[] =>
  readJson<Booking[]>(STORAGE_KEYS.bookings, []);

export const userService = {
  async getUsers(): Promise<User[]> {
    console.log('[userService] getUsers');
    await delay(350);
    return getAllUsers();
  },

  async getUserById(id: string): Promise<User> {
    console.log('[userService] getUserById', id);
    await delay(300);
    const users = getAllUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw { message: 'User not found' };
    }
    return user;
  },

  async updateUser(
    id: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>
  ): Promise<User> {
    console.log('[userService] updateUser', id, userData);
    await delay(400);
    const users = getAllUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw { message: 'User not found' };
    }
    const updated: User = {
      ...users[index],
      ...userData
    };
    users[index] = updated;
    saveUsers(users);
    return updated;
  },

  async changeUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    console.log('[userService] changeUserRole', id, role);
    await delay(350);
    return this.updateUser(id, { role });
  },

  async deleteUser(id: string): Promise<void> {
    console.log('[userService] deleteUser', id);
    await delay(350);
    const users = getAllUsers();
    const remaining = users.filter((u) => u.id !== id);
    saveUsers(remaining);
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    console.log('[userService] getUserBookings', userId);
    await delay(350);
    const bookings = getAllBookings();
    return bookings.filter((b) => b.userId === userId);
  }
};

