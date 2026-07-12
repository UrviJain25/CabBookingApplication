import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookingApi, TripBookingResponseDto } from '../../services/api';

export default function UserLiveTracking() {
  const [activeBookings, setActiveBookings] = useState<TripBookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const fetch = async () => {
      if (!customerId) { setLoading(false); return; }
      try {
        const res = await bookingApi.getHistory(parseInt(customerId));
        setActiveBookings(res.data.filter(b => b.status));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
            <p className="text-gray-600 mt-1">Track your active rides in real time</p>
          </div>

          {/* Map Area */}
          <div className="card-base overflow-hidden mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 h-72 flex flex-col items-center justify-center relative">
              <MapPin className="w-14 h-14 text-primary opacity-40 mb-3" />
              <p className="text-blue-800 font-semibold text-lg">Live Map</p>
              <p className="text-blue-600 text-sm mt-1 text-center px-4">Real-time GPS tracking will appear here</p>
              <div className="absolute top-8 left-1/3 bg-primary text-white text-xs px-3 py-1 rounded-full animate-bounce shadow">
                🚗 Your Cab
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Active Bookings</h2>

            {loading ? (
              <div className="py-6 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🚕</div>
                <p className="text-gray-600 font-medium">No active rides right now</p>
                <p className="text-gray-500 text-sm mt-1">Book a ride to start tracking</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map(b => (
                  <div key={b.tripBookingId} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Booking #{b.tripBookingId}</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">● Active</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{b.fromLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Navigation className="w-4 h-4 text-red-500" />
                        <span>{b.toLocation}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Driver: <span className="font-medium">{b.driverName || '—'}</span></span>
                      <span className="font-mono text-gray-700">{b.cabNumber || '—'}</span>
                    </div>
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
