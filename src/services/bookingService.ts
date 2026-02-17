import { STORAGE_KEYS } from '../constants/storageKeys';
import { Booking, BookingStatus, TimeSlot } from '../types/models';
import { readJson, writeJson } from '../utils/storage';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllBookings = (): Booking[] => {
  return readJson<Booking[]>(STORAGE_KEYS.bookings, []);
};

const saveBookings = (bookings: Booking[]): void => {
  writeJson(STORAGE_KEYS.bookings, bookings);
};

const calculateTotalPrice = (booking: Omit<Booking, 'totalPrice' | 'createdAt' | 'id'>): number => {
  const base = 100;
  const durationFactor = booking.duration * 150;
  const guestsFactor = booking.guestCount * 10;
  return base + durationFactor + guestsFactor;
};

export const bookingService = {
  async createBooking(
    bookingData: Omit<Booking, 'id' | 'status' | 'totalPrice' | 'createdAt'>
  ): Promise<Booking> {
    console.log('[bookingService] createBooking', bookingData);
    await delay(400);
    const bookings = getAllBookings();

    const isDoubleBooked = bookings.some(
      (b) =>
        b.eventDate === bookingData.eventDate &&
        b.startTime === bookingData.startTime &&
        b.status !== 'cancelled'
    );
    if (isDoubleBooked) {
      throw { message: 'Selected time slot is no longer available' };
    }

    const totalPrice = calculateTotalPrice(bookingData);
    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      status: 'pending',
      totalPrice,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    saveBookings(bookings);
    return newBooking;
  },

  async getBookings(userId?: string): Promise<Booking[]> {
    console.log('[bookingService] getBookings', userId);
    await delay(350);
    const bookings = getAllBookings();
    if (!userId) return bookings;
    return bookings.filter((b) => b.userId === userId);
  },

  async getBookingById(id: string): Promise<Booking> {
    console.log('[bookingService] getBookingById', id);
    await delay(300);
    const bookings = getAllBookings();
    const found = bookings.find((b) => b.id === id);
    if (!found) {
      throw { message: 'Booking not found' };
    }
    return found;
  },

  async updateBooking(
    id: string,
    bookingData: Partial<Omit<Booking, 'id' | 'createdAt'>>
  ): Promise<Booking> {
    console.log('[bookingService] updateBooking', id, bookingData);
    await delay(400);
    const bookings = getAllBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw { message: 'Booking not found' };
    }
    const current = bookings[index];
    if (current.status !== 'pending') {
      throw { message: 'Only pending bookings can be edited' };
    }
    const updated: Booking = {
      ...current,
      ...bookingData
    };
    if (
      bookingData.eventDate !== undefined ||
      bookingData.startTime !== undefined ||
      bookingData.duration !== undefined ||
      bookingData.guestCount !== undefined
    ) {
      updated.totalPrice = calculateTotalPrice({
        userId: updated.userId,
        eventType: updated.eventType,
        eventDate: updated.eventDate,
        startTime: updated.startTime,
        duration: updated.duration,
        guestCount: updated.guestCount,
        specialRequests: updated.specialRequests
      });
    }
    bookings[index] = updated;
    saveBookings(bookings);
    return updated;
  },

  async deleteBooking(id: string): Promise<void> {
    console.log('[bookingService] deleteBooking', id);
    await delay(350);
    const bookings = getAllBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    saveBookings(filtered);
  },

  async changeBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    console.log('[bookingService] changeBookingStatus', id, status);
    await delay(350);
    const bookings = getAllBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw { message: 'Booking not found' };
    }
    bookings[index] = { ...bookings[index], status };
    saveBookings(bookings);
    return bookings[index];
  },

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    console.log('[bookingService] getAvailableSlots', date);
    await delay(300);
    const bookings = getAllBookings();
    const hours = ['10:00', '12:00', '14:00', '16:00', '18:00'];
    return hours.map((time) => {
      const existing = bookings.find(
        (b) => b.eventDate === date && b.startTime === time && b.status !== 'cancelled'
      );
      return {
        date,
        time,
        available: !existing,
        bookingId: existing?.id
      };
    });
  }
};

