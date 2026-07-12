import { useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, Car, BarChart3, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardApi, bookingApi, DashboardDto, TripBookingResponseDto } from '../../services/api';

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3500 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4800 },
  { month: 'May', revenue: 6200 },
  { month: 'Jun', revenue: 7100 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardDto | null>(null);
  const [recentBookings, setRecentBookings] = useState<TripBookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, bookRes] = await Promise.all([
        dashboardApi.getStats(),
        bookingApi.getAll(),
      ]);
      setStats(dashRes.data);
      setRecentBookings(bookRes.data.slice(0, 4));
    } catch (err: any) {
      setError('Failed to load dashboard data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bookingMixData = [
    { name: 'Active', value: stats?.activeBookings || 0 },
    { name: 'Completed', value: Math.max(0, (stats?.totalBookings || 0) - (stats?.activeBookings || 0)) },
  ].filter(d => d.value > 0);

  const metrics = stats
    ? [
        {
          icon: MapPin,
          label: 'Total Bookings',
          value: stats.totalBookings.toLocaleString(),
          change: `${stats.activeBookings} active`,
          positive: true,
        },
        {
          icon: Car,
          label: 'Total Cabs',
          value: stats.totalCabs.toString(),
          change: `${stats.availableCabs} available`,
          positive: stats.availableCabs > 0,
        },
        {
          icon: Users,
          label: 'Total Customers',
          value: stats.totalCustomers.toString(),
          change: 'Registered users',
          positive: true,
        },
        {
          icon: BarChart3,
          label: 'Total Drivers',
          value: stats.totalDrivers.toString(),
          change: 'Fleet drivers',
          positive: true,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time view of your fleet, bookings and revenue</p>
            </div>
            <button
              onClick={fetchData}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
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

          {/* Metrics */}
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
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className="metric-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-semibold ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    dot={{ fill: '#3b82f6', r: 4 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Status</h2>
              {bookingMixData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingMixData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {bookingMixData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  No booking data yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.tripBookingId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Booking #{booking.tripBookingId} — Customer #{booking.customerId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.fromLocation} → {booking.toLocation}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        booking.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status ? 'Active' : 'Cancelled'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
