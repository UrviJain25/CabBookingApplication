import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { BarChart3, TrendingUp, Users, Car } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', bookings: 45, revenue: 12000 },
  { month: 'Feb', bookings: 52, revenue: 15500 },
  { month: 'Mar', bookings: 61, revenue: 18200 },
  { month: 'Apr', bookings: 48, revenue: 13800 },
  { month: 'May', bookings: 70, revenue: 21000 },
  { month: 'Jun', bookings: 85, revenue: 25500 },
  { month: 'Jul', bookings: 92, revenue: 27600 },
];

export default function AdminReports() {
  const summary = [
    { label: 'Total Revenue', value: '₹1,33,600', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    { label: 'Total Bookings', value: '453', icon: BarChart3, color: 'bg-blue-100 text-blue-700' },
    { label: 'Avg per Booking', value: '₹295', icon: Car, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Active Customers', value: '128', icon: Users, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Business performance overview</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summary.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="card-base p-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-base p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Monthly Bookings</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card-base p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue (₹)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
