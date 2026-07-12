import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Award, Zap, MapPin, Star, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { bookingApi, TripBookingResponseDto } from '../../services/api';

export default function UserRideHistory() {
  const [bookings, setBookings] = useState<TripBookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customerId = localStorage.getItem('customerId');

  const fetchHistory = async () => {
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
      setError('Failed to load ride history. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalRides = bookings.length;
  const totalBill = bookings.reduce((sum, b) => sum + (b.bill || 0), 0);
  const totalDistance = bookings.reduce((sum, b) => sum + (b.distanceInKm || 0), 0);
  const avgBill = totalRides > 0 ? totalBill / totalRides : 0;

  const stats = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Total Rides',
      value: totalRides.toString(),
      subtext: 'Completed rides',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Total Distance',
      value: `${totalDistance.toFixed(1)} km`,
      subtext: 'Distance traveled',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Total Spent',
      value: `₹${totalBill.toFixed(2)}`,
      subtext: `Avg: ₹${avgBill.toFixed(2)}/ride`,
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Active Bookings',
      value: bookings.filter(b => b.status).length.toString(),
      subtext: 'Currently active',
    },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateStr; }
  };

  // Group bookings by month
  const monthlyMap: Record<string, TripBookingResponseDto[]> = {};
  bookings.forEach((b) => {
    if (!b.fromDateTime) return;
    const key = new Date(b.fromDateTime).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    if (!monthlyMap[key]) monthlyMap[key] = [];
    monthlyMap[key].push(b);
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, rides]) => ({
    month,
    rides: rides.length,
    distance: rides.reduce((s, r) => s + (r.distanceInKm || 0), 0).toFixed(1) + ' km',
    fare: '₹' + rides.reduce((s, r) => s + (r.bill || 0), 0).toFixed(2),
  }));

  // Reverse for timeline (most recent first)
  const timeline = [...bookings].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ride History</h1>
              <p className="text-gray-600 mt-1">Your complete ride analytics and statistics</p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="metric-card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="metric-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 p-3 rounded-lg text-primary">{stat.icon}</div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-2">{stat.subtext}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Breakdown */}
            <div className="lg:col-span-2 card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Breakdown</h2>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : monthlyData.length === 0 ? (
                <p className="text-gray-500 text-sm">No ride data yet.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Month</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Rides</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Distance</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Fare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((record, idx) => (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{record.month}</td>
                            <td className="py-3 px-4 text-gray-700">{record.rides}</td>
                            <td className="py-3 px-4 text-gray-700">{record.distance}</td>
                            <td className="py-3 px-4 font-semibold text-gray-900">{record.fare}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bar Chart */}
                  <div className="mt-8 space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Ride Distribution</h3>
                    {monthlyData.map((record, idx) => {
                      const maxRides = Math.max(...monthlyData.map((m) => m.rides), 1);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-600 w-28 truncate">{record.month}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(record.rides / maxRides) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-900 w-16 text-right">
                            {record.rides} ride{record.rides !== 1 ? 's' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Timeline */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Timeline</h2>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : timeline.length === 0 ? (
                <p className="text-gray-500 text-sm">No rides to show.</p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((ride, idx) => (
                    <div key={ride.tripBookingId} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0" />
                        {idx < timeline.length - 1 && (
                          <div className="w-0.5 bg-gray-200 flex-1 mt-1" style={{ minHeight: 32 }} />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-xs text-gray-500">{formatDate(ride.fromDateTime)}</p>
                        <p className="font-medium text-gray-900 mt-0.5 text-sm">
                          {ride.fromLocation} → {ride.toLocation}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-semibold ${
                              ride.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ride.status ? 'Active' : 'Cancelled'}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {ride.bill ? `₹${ride.bill.toFixed(2)}` : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
