import { Booking, BookingStatus, TimeSlot } from '../types/models';
import api from './apiClient';

interface BookingApiDto {
  id: number;
  userId: number;
  eventTypeId: number;
  eventTypeName: string;
  eventDate: string;
  startTime: string;
  duration: number;
  guestCount: number;
  specialRequests?: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

const mapBooking = (dto: BookingApiDto): Booking => ({
  id: String(dto.id),
  userId: String(dto.userId),
  eventType: dto.eventTypeName,
  eventDate: dto.eventDate,
  startTime: dto.startTime,
  duration: dto.duration,
  guestCount: dto.guestCount,
  specialRequests: dto.specialRequests,
  status: dto.status,
  totalPrice: dto.totalPrice,
  createdAt: dto.createdAt
});

export const bookingService = {
  async createBooking(
    bookingData: Omit<Booking, 'id' | 'status' | 'totalPrice' | 'createdAt'>
  ): Promise<Booking> {
    const response = await api.post<BookingApiDto>('/api/bookings', {
      userId: Number(bookingData.userId),
      eventTypeId: Number(bookingData.eventType),
      eventDate: bookingData.eventDate,
      startTime: bookingData.startTime,
      duration: bookingData.duration,
      guestCount: bookingData.guestCount,
      specialRequests: bookingData.specialRequests
    });
    return mapBooking(response.data);
  },

  async getBookings(userId?: string): Promise<Booking[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const response = await api.get<BookingApiDto[]>(`/api/bookings${query}`);
    return response.data.map(mapBooking);
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<BookingApiDto>(`/api/bookings/${id}`);
    return mapBooking(response.data);
  },

  async updateBooking(
    id: string,
    bookingData: Partial<Omit<Booking, 'id' | 'createdAt'>>
  ): Promise<Booking> {
    const currentResponse = await api.get<BookingApiDto>(`/api/bookings/${id}`);
    const current = currentResponse.data;
    const eventTypeId = Number(bookingData.eventType ?? current.eventTypeId);
    const payload = {
      eventTypeId: Number.isNaN(eventTypeId) ? 0 : eventTypeId,
      eventDate: bookingData.eventDate ?? current.eventDate,
      startTime: bookingData.startTime ?? current.startTime,
      duration: bookingData.duration ?? current.duration,
      guestCount: bookingData.guestCount ?? current.guestCount,
      specialRequests: bookingData.specialRequests ?? current.specialRequests
    };
    const response = await api.put<BookingApiDto>(`/api/bookings/${id}`, payload);
    return mapBooking(response.data);
  },

  async deleteBooking(id: string): Promise<void> {
    await api.delete(`/api/bookings/${id}`);
  },

  async changeBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const response = await api.patch<BookingApiDto>(`/api/bookings/${id}/status`, {
      status
    });
    return mapBooking(response.data);
  },

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    const bookings = await this.getBookings();
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

