import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface Booking {
  id: string;
  userId: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  duration: number;
  guestCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'users'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBookings = JSON.parse(localStorage.getItem('venue_bookings') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('venue_users') || '[]');
    setBookings(allBookings);
    setUsers(allUsers);
  };

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    localStorage.setItem('venue_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('venue_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? All their bookings will remain.')) return;
    
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('venue_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = searchTerm === '' || 
      b.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserById(b.userId)?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(u =>
    searchTerm === '' ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-900/60 text-emerald-200';
      case 'pending': return 'bg-yellow-900/60 text-yellow-200';
      case 'cancelled': return 'bg-red-900/60 text-red-200';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Manage all bookings, users, and venue operations.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-4">
        <Card title="Total Bookings">
          <p className="text-4xl font-bold text-brand-400">{bookings.length}</p>
          <p className="text-xs text-slate-400 mt-2">All time</p>
        </Card>

        <Card title="Pending Approval">
          <p className="text-4xl font-bold text-yellow-400">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
          <p className="text-xs text-slate-400 mt-2">Needs review</p>
        </Card>

        <Card title="Total Revenue">
          <p className="text-4xl font-bold text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-2">Confirmed bookings</p>
        </Card>

        <Card title="Total Users">
          <p className="text-4xl font-bold text-slate-200">{users.length}</p>
          <p className="text-xs text-slate-400 mt-2">Registered accounts</p>
        </Card>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 text-sm font-medium transition border-b-2 ${
              activeTab === 'bookings'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-sm font-medium transition border-b-2 ${
              activeTab === 'users'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder={activeTab === 'bookings' ? 'Search by event type or user email...' : 'Search by name or email...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input flex-1 min-w-[200px]"
          />

          {activeTab === 'bookings' && (
            <div className="flex gap-2">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition capitalize ${
                    statusFilter === status
                      ? 'bg-brand-500 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'bookings' ? (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <p className="text-center py-12 text-slate-400">No bookings found</p>
            ) : (
              filteredBookings.map((booking) => {
                const user = getUserById(booking.userId);
                return (
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
                          {new Date(booking.eventDate).toLocaleDateString()} at {booking.startTime} • {booking.duration}h
                        </p>
                        {user && (
                          <p className="text-xs text-slate-500 mt-1">
                            Customer: {user.firstName} {user.lastName} ({user.email})
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-slate-500 text-xs">Guests</p>
                        <p className="text-slate-200">{booking.guestCount} people</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Price</p>
                        <p className="text-slate-200 font-semibold">${booking.totalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Booked On</p>
                        <p className="text-slate-200">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Booking ID</p>
                        <p className="text-slate-200 text-xs font-mono">{booking.id.slice(-8)}</p>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mb-4 p-3 bg-slate-900/50 rounded text-xs">
                        <p className="text-slate-400 mb-1">Special Requests:</p>
                        <p className="text-slate-300">{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center py-12 text-slate-400">No users found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{user.email}</td>
                      <td className="py-3 px-4 text-slate-300">{user.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-purple-900/60 text-purple-200'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
