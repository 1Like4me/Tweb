export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  duration: number;
  guestCount: number;
  specialRequests?: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  maxCapacity: number;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  bookingId?: string;
}

export interface VenueSettings {
  id: string;
  name: string;
  maxCapacity: number;
  openHour: string;
  closeHour: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface BookingFormValues {
  eventType: string;
  eventDate: string;
  startTime: string;
  duration: number;
  guestCount: number;
  specialRequests: string;
}

export interface ApiError {
  message: string;
}

