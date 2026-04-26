import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Booking } from '../../types/models';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setBookings([]);
      return;
    }

    bookingService
      .getBookings(user.id)
      .then(setBookings)
      .catch(() => setBookings([]));
  }, [user?.id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingBookings = bookings.filter(b =>
    b.status !== 'cancelled' && new Date(b.eventDate) >= today
  ).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const totalSpent = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-900/60 text-emerald-200';
      case 'pending': return 'bg-yellow-900/60 text-yellow-200';
      case 'cancelled': return 'bg-red-900/60 text-red-200';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Welcome back, {user?.firstName ?? 'Guest'}! 👋
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Here's an overview of your bookings and account activity.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-4">
        <Card title="Total Bookings">
          <p className="text-4xl font-bold text-brand-400">{bookings.length}</p>
          <p className="text-xs text-slate-400 mt-2">All time</p>
        </Card>

        <Card title="Upcoming Events">
          <p className="text-4xl font-bold text-emerald-400">{upcomingBookings.length}</p>
          <p className="text-xs text-slate-400 mt-2">Scheduled</p>
        </Card>

        <Card title="Pending Approval">
          <p className="text-4xl font-bold text-yellow-400">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
          <p className="text-xs text-slate-400 mt-2">Awaiting confirmation</p>
        </Card>

        <Card title="Total Spent">
          <p className="text-4xl font-bold text-slate-200">
            ${totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-2">Confirmed bookings</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card 
          title="Upcoming Events" 
          subtitle="Your next scheduled bookings"
          actions={
            <Link to="/my-bookings">
              <Button size="sm" variant="ghost">
                View All
              </Button>
            </Link>
          }
        >
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No upcoming events</p>
              <Link to="/booking">
                <Button variant="primary" size="sm">
                  Book an Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">
                        {booking.eventType}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {new Date(booking.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} • {booking.startTime} • {booking.duration}h
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{booking.guestCount} guests</span>
                    <span className="text-slate-200 font-semibold">${booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Quick Actions" className="border-brand-500/40">
            <div className="space-y-3">
              <Link to="/booking" className="block">
                <Button variant="primary" size="md" className="w-full">
                  📅 New Booking
                </Button>
              </Link>
              <Link to="/my-bookings" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  📋 View All Bookings
                </Button>
              </Link>
              <Link to="/services" className="block">
                <Button variant="ghost" size="md" className="w-full">
                  🎉 Browse Services
                </Button>
              </Link>
            </div>
          </Card>

          <Card title="Account Info">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Name</p>
                <p className="text-slate-200">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Email</p>
                <p className="text-slate-200">{user?.email}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Phone</p>
                <p className="text-slate-200">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Member Since</p>
                <p className="text-slate-200">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Recent Activity" subtitle="Your latest bookings">
        {recentBookings.length === 0 ? (
          <p className="text-center py-8 text-slate-400">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 text-sm"
              >
                <div>
                  <p className="text-slate-200 font-medium">{booking.eventType}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-200 font-semibold">${booking.totalPrice.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
