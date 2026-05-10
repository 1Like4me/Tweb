import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Booking } from '../../types/models';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { Modal } from '../../components/common/Modal';

export const MyBookingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal State
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Show success message if navigated from booking page
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    loadBookings();
  }, [location]);

  const loadBookings = () => {
    if (!user?.id) {
      setBookings([]);
      return;
    }
    bookingService
      .getBookings(user.id)
      .then(setBookings)
      .catch(() => setBookings([]));
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
  };

  const confirmCancelBooking = () => {
    if (!cancelBookingId) return;
    bookingService
      .changeBookingStatus(cancelBookingId, 'cancelled')
      .then(() => {
        loadBookings();
        setCancelBookingId(null);
      })
      .catch(() => setCancelBookingId(null));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-900/60 text-emerald-200';
      case 'pending': return 'bg-yellow-900/60 text-yellow-200';
      case 'cancelled': return 'bg-red-900/60 text-red-200';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const upcomingBookings = bookings.filter(b => 
    b.status !== 'cancelled' && new Date(b.eventDate) >= new Date()
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Manage your event bookings and view booking history.
        </p>
      </section>

      {successMessage && (
        <div className="rounded-lg bg-emerald-900/30 border border-emerald-600/50 px-4 py-3 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Total Bookings">
          <p className="text-3xl font-bold text-brand-400">{bookings.length}</p>
        </Card>
        <Card title="Upcoming Events">
          <p className="text-3xl font-bold text-emerald-400">{upcomingBookings.length}</p>
        </Card>
        <Card title="Total Spent">
          <p className="text-3xl font-bold text-slate-200">
            ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card 
        title="All Bookings" 
        subtitle={`${filteredBookings.length} booking(s)`}
        actions={
          <div className="flex gap-2">
            <Link to="/booking">
              <Button size="sm" variant="primary">
                New Booking
              </Button>
            </Link>
          </div>
        }
      >
        <div className="mb-4 flex gap-2">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs rounded-lg transition capitalize ${
                filter === status
                  ? 'bg-brand-500 text-slate-950 font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No bookings found</p>
            <Link to="/booking">
              <Button variant="primary" size="sm">
                Create Your First Booking
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">
                      {booking.eventType}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(booking.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {booking.startTime}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-500 text-xs">Duration</p>
                    <p className="text-slate-200">{booking.duration} hours</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Guests</p>
                    <p className="text-slate-200">{booking.guestCount} people</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Total Price</p>
                    <p className="text-slate-200 font-semibold">${booking.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Booked On</p>
                    <p className="text-slate-200">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-2 p-3 bg-slate-900/50 rounded text-xs">
                    <p className="text-slate-400 mb-1">Special Requests:</p>
                    <p className="text-slate-300">{booking.specialRequests}</p>
                  </div>
                )}

                {booking.customMenu && (
                  <div className="mb-4 p-3 bg-brand-900/10 border border-brand-500/20 rounded text-xs">
                    <p className="text-brand-400 font-semibold mb-1">Customized Menu:</p>
                    <p className="text-slate-300 italic">{booking.customMenu}</p>
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate('/booking', { state: { editBooking: booking } })}
                    >
                      Edit Booking
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={cancelBookingId !== null}
        title="Cancel Booking"
        onCancel={() => setCancelBookingId(null)}
        onConfirm={confirmCancelBooking}
        confirmLabel="Cancel Booking"
        variant="danger"
      >
        Are you sure you want to cancel this booking? This action will set the status to "cancelled".
      </Modal>
    </div>
  );
};
