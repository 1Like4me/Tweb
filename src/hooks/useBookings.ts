import { useCallback, useEffect, useMemo, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/models';

export interface BookingFilters {
  status?: string;
  eventType?: string;
}

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<BookingFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getBookings(userId);
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const filtered = useMemo(() => {
    let result = [...bookings];
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((b) =>
        `${b.id} ${b.eventType} ${b.specialRequests ?? ''}`
          .toLowerCase()
          .includes(term)
      );
    }
    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters.eventType) {
      result = result.filter((b) => b.eventType === filters.eventType);
    }
    result.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'date') {
        comp = a.eventDate.localeCompare(b.eventDate);
      } else if (sortBy === 'price') {
        comp = a.totalPrice - b.totalPrice;
      } else if (sortBy === 'status') {
        comp = a.status.localeCompare(b.status);
      }
      return sortDir === 'asc' ? comp : -comp;
    });
    return result;
  }, [bookings, filters.eventType, filters.status, search, sortBy, sortDir]);

  return {
    bookings,
    filtered,
    isLoading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    reload: loadBookings
  };
};

