import { useState, useEffect } from 'react';
import { MapPin, Clock, XCircle, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { bookingApi, TripBookingResponseDto } from '../../services/api';

export default function UserBookings() {
  const [bookings, setBookings] = useState<TripBookingResponseDto[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

  const customerId = localStorage.getItem('customerId');

  const fetchBookings = async () => {
    if (!customerId) {
      setError('Customer ID not found. Please log out and log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getHistory(parseInt(customerId));
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings. Make sure the backend is running.');
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

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return b.status;
    if (filterStatus === 'cancelled') return !b.status;
    return true;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Track all your rides</p>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
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

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'active', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading your bookings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((booking) => (
                <div key={booking.tripBookingId} className="card-base p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Booking #{booking.tripBookingId}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {booking.status ? 'Active' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(booking.fromDateTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {booking.bill ? `₹${booking.bill.toFixed(2)}` : '—'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.distanceInKm ? `${booking.distanceInKm} km` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div className="w-0.5 h-8 bg-gray-300 my-1" />
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Pickup</p>
                          <p className="text-gray-900 font-medium">{booking.fromLocation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Drop-off</p>
                          <p className="text-gray-900 font-medium">{booking.toLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Cab */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Driver</p>
                      <p className="font-medium text-gray-900">{booking.driverName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Cab</p>
                      <p className="font-mono font-medium text-gray-900">{booking.cabNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Completed</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.toDateTime)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCancel(booking.tripBookingId)}
                        disabled={cancelling === booking.tripBookingId}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        {cancelling === booking.tripBookingId ? (
                          <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🚕</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-6">
                    {filterStatus === 'all' ? 'Start by booking your first ride' : `No ${filterStatus} rides`}
                  </p>
                  <Link to="/user/book-ride" className="btn-primary inline-block">
                    Book a Ride Now
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
