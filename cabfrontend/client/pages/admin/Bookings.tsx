import { useState, useEffect } from 'react';
import { Search, RefreshCw, XCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { bookingApi, TripBookingResponseDto } from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<TripBookingResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getAll();
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      const res = await bookingApi.cancel(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.tripBookingId === bookingId ? res.data : b))
      );
    } catch {
      alert('Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      String(b.tripBookingId).includes(searchTerm) ||
      (b.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.customerId).includes(searchTerm);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && b.status) ||
      (filterStatus === 'cancelled' && !b.status);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: boolean) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {status ? 'Active' : 'Cancelled'}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
              <p className="text-gray-600 mt-1">Manage every trip across your fleet</p>
            </div>
            <button
              onClick={fetchBookings}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Search & Filter */}
          <div className="card-base p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, customer, driver, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="card-base overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading bookings...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Booking ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">From</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">To</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Cab</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Bill</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.tripBookingId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">#{booking.tripBookingId}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">#{booking.customerId}</td>
                        <td className="px-6 py-4 text-gray-700">{booking.driverName || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 text-sm max-w-[140px] truncate">{booking.fromLocation}</td>
                        <td className="px-6 py-4 text-gray-700 text-sm max-w-[140px] truncate">{booking.toLocation}</td>
                        <td className="px-6 py-4 text-gray-700 font-mono text-sm">{booking.cabNumber || '—'}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ₹{booking.bill?.toFixed(2) || '—'}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                        <td className="px-6 py-4 text-center">
                          {booking.status && (
                            <button
                              onClick={() => handleCancel(booking.tripBookingId)}
                              disabled={cancelling === booking.tripBookingId}
                              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              title="Cancel booking"
                            >
                              {cancelling === booking.tripBookingId ? (
                                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBookings.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
