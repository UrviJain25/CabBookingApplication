import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Star, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { bookingApi, TripBookingResponseDto } from '../../services/api';

export default function UserDashboard() {
  const [bookings, setBookings] = useState<TripBookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('customerName') || localStorage.getItem('username') || 'User';

  const fetchBookings = async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getHistory(parseInt(customerId));
      setBookings(res.data);
    } catch {
      setError('Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const completedBookings = bookings.filter((b) => !b.status || b.toDateTime);
  const activeBookings = bookings.filter((b) => b.status);
  const totalBill = bookings.reduce((sum, b) => sum + (b.bill || 0), 0);
  const totalDistance = bookings.reduce((sum, b) => sum + (b.distanceInKm || 0), 0);
  const recentBookings = [...bookings].reverse().slice(0, 3);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return dateStr;
    }
  };

  const stats = [
    {
      icon: Zap,
      label: 'Total Rides',
      value: bookings.length.toString(),
      change: `${activeBookings.length} active`,
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `₹${totalBill.toFixed(2)}`,
      change: bookings.length > 0 ? `Avg: ₹${(totalBill / bookings.length).toFixed(2)}/ride` : '—',
    },
    {
      icon: TrendingUp,
      label: 'Distance Traveled',
      value: `${totalDistance.toFixed(1)} km`,
      change: 'All time',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 space-y-8">

          {/* Welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 lg:p-8 text-white">
            <h1 className="text-3xl font-bold mb-1">Welcome back, {customerName}! 👋</h1>
            <p className="text-blue-100">
              {bookings.length > 0
                ? `You have ${bookings.length} total ride${bookings.length > 1 ? 's' : ''}`
                : 'Ready to book your first ride?'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={fetchBookings} className="text-red-700 hover:underline text-sm">Retry</button>
            </div>
          )}

          {!customerId && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              ⚠️ Your customer ID wasn't resolved. Please <Link to="/login" className="underline font-medium">log out and log in again</Link> for full functionality.
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="metric-card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="metric-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">{stat.change}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Action */}
          <Link to="/user/book-ride" className="block btn-primary text-center w-full text-lg py-4">
            🚕 Book a Ride Now
          </Link>

          {/* Recent Rides */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🚕</div>
                <p className="text-gray-500">No rides yet. Book your first ride!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.tripBookingId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Booking #{booking.tripBookingId}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(booking.fromDateTime)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded ${
                          booking.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status ? 'Active' : 'Cancelled'}
                      </span>
                    </div>

                    <div className="space-y-1 my-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{booking.fromLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{booking.toLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        Driver: <span className="font-medium text-gray-900">{booking.driverName || '—'}</span>
                        {booking.cabNumber && (
                          <span className="ml-2 font-mono text-xs text-gray-500">{booking.cabNumber}</span>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {booking.bill ? `₹${booking.bill.toFixed(2)}` : '—'}
                      </p>
                    </div>
                  </div>
                ))}

                <Link
                  to="/user/bookings"
                  className="mt-2 inline-block text-primary hover:underline font-medium text-sm"
                >
                  View all rides →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
