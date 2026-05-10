import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Booking, User } from '../../types/models';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import { AdminChatDashboard } from '../../components/chat/AdminChatDashboard';
import { Modal } from '../../components/common/Modal';

export const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'chat'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Modal States
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([bookingService.getBookings(), userService.getUsers()])
      .then(([allBookings, allUsers]) => {
        setBookings(allBookings);
        setUsers(allUsers);
      })
      .catch(() => {
        setBookings([]);
        setUsers([]);
      });
  };

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    bookingService
      .changeBookingStatus(bookingId, newStatus)
      .then(() => loadData())
      .catch(() => undefined);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setDeleteBookingId(bookingId);
  };

  const confirmDeleteBooking = () => {
    if (!deleteBookingId) return;
    bookingService
      .deleteBooking(deleteBookingId)
      .then(() => {
        loadData();
        setDeleteBookingId(null);
      })
      .catch(() => setDeleteBookingId(null));
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDeleteUser = () => {
    if (!deleteUserId) return;
    userService
      .deleteUser(deleteUserId)
      .then(() => {
        loadData();
        setDeleteUserId(null);
      })
      .catch(() => setDeleteUserId(null));
  };

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    userService
      .changeUserRole(userId, newRole)
      .then(() => loadData())
      .catch(() => undefined);
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
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-4 text-sm font-medium transition border-b-2 ${
              activeTab === 'chat'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Chat
          </button>
        </div>

        {activeTab !== 'chat' && (
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
        )}

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
        ) : activeTab === 'users' ? (
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
                        <div className="flex gap-2">
                          {user.role === 'admin' ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleRoleChange(user.id, 'user')}
                            >
                              Demote
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleRoleChange(user.id, 'admin')}
                            >
                              Promote
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <AdminChatDashboard />
        )}
      </Card>

      <Modal
        isOpen={deleteBookingId !== null}
        title="Delete Booking"
        onCancel={() => setDeleteBookingId(null)}
        onConfirm={confirmDeleteBooking}
        confirmLabel="Delete"
        variant="danger"
      >
        Are you sure you want to delete this booking? This action cannot be undone.
      </Modal>

      <Modal
        isOpen={deleteUserId !== null}
        title="Delete User"
        onCancel={() => setDeleteUserId(null)}
        onConfirm={confirmDeleteUser}
        confirmLabel="Delete"
        variant="danger"
      >
        Are you sure you want to delete this user? All their bookings will remain.
      </Modal>
    </div>
  );
};
