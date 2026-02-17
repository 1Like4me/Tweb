import { Booking, EventType, User, VenueSettings } from '../types/models';
import { STORAGE_KEYS } from './storageKeys';

const adminUser: User = {
  id: 'u-admin',
  email: 'admin@venue.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+40 700 000 000',
  role: 'admin',
  createdAt: new Date().toISOString()
};

const regularUser: User = {
  id: 'u-user',
  email: 'user@venue.com',
  password: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+40 711 111 111',
  role: 'user',
  createdAt: new Date().toISOString()
};

export const initialUsers: User[] = [adminUser, regularUser];

export const initialEventTypes: EventType[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Elegant wedding celebrations with full-service coordination.',
    basePrice: 3000,
    maxCapacity: 200
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    description: 'Intimate or grand birthday parties with custom decor.',
    basePrice: 500,
    maxCapacity: 50
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    description: 'Professional conferences, product launches, and team buildings.',
    basePrice: 2000,
    maxCapacity: 100
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    description: 'Celebrate milestones with style and unforgettable ambiance.',
    basePrice: 1500,
    maxCapacity: 80
  },
  {
    id: 'holiday',
    name: 'Holiday Party',
    description: 'Festive gatherings for Christmas, New Year, and more.',
    basePrice: 1000,
    maxCapacity: 60
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Mark the next chapter with a memorable celebration.',
    basePrice: 800,
    maxCapacity: 70
  }
];

export const initialVenueSettings: VenueSettings = {
  id: 'venue',
  name: 'Elegance Venue',
  maxCapacity: 220,
  openHour: '09:00',
  closeHour: '23:00'
};

export const initialBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u-user',
    eventType: 'wedding',
    eventDate: new Date(new Date().setDate(new Date().getDate() + 14))
      .toISOString()
      .slice(0, 10),
    startTime: '16:00',
    duration: 8,
    guestCount: 150,
    specialRequests: 'Golden decorations and string quartet.',
    status: 'confirmed',
    totalPrice: 4800,
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    userId: 'u-user',
    eventType: 'birthday',
    eventDate: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .slice(0, 10),
    startTime: '18:00',
    duration: 4,
    guestCount: 35,
    specialRequests: 'Photo booth and custom cake.',
    status: 'pending',
    totalPrice: 900,
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    userId: 'u-admin',
    eventType: 'corporate',
    eventDate: new Date(new Date().setDate(new Date().getDate() + 21))
      .toISOString()
      .slice(0, 10),
    startTime: '10:00',
    duration: 6,
    guestCount: 80,
    specialRequests: 'Projector and conference setup.',
    status: 'cancelled',
    totalPrice: 2600,
    createdAt: new Date().toISOString()
  }
];

export const seedMockData = (): void => {
  if (!window.localStorage.getItem(STORAGE_KEYS.users)) {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(initialUsers));
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.bookings)) {
    window.localStorage.setItem(
      STORAGE_KEYS.bookings,
      JSON.stringify(initialBookings)
    );
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.eventTypes)) {
    window.localStorage.setItem(
      STORAGE_KEYS.eventTypes,
      JSON.stringify(initialEventTypes)
    );
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.venueSettings)) {
    window.localStorage.setItem(
      STORAGE_KEYS.venueSettings,
      JSON.stringify(initialVenueSettings)
    );
  }
};

