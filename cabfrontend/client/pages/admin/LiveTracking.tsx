import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MapPin, Navigation } from 'lucide-react';

export default function AdminLiveTracking() {
  const mockCabs = [
    { id: 'KA-03-AB-2245', driver: 'Rahul Verma', status: 'On Trip', from: 'MG Road', to: 'Airport', lat: 12.9716, lng: 77.5946 },
    { id: 'KA-05-JD-2270', driver: 'Sanjay Iyer', status: 'Available', from: '—', to: '—', lat: 12.9352, lng: 77.6245 },
    { id: 'KA-04-XY-9999', driver: 'Unassigned', status: 'Available', from: '—', to: '—', lat: 12.9141, lng: 77.6411 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
            <p className="text-gray-600 mt-1">Real-time fleet location overview</p>
          </div>

          {/* Map Placeholder */}
          <div className="card-base p-0 mb-6 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-80 flex flex-col items-center justify-center relative">
              <MapPin className="w-16 h-16 text-primary opacity-40 mb-3" />
              <p className="text-blue-700 font-semibold text-lg">Live Map View</p>
              <p className="text-blue-600 text-sm mt-1">Integrate Google Maps or Leaflet for real-time tracking</p>
              {/* Decorative pins */}
              <div className="absolute top-12 left-1/4 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">🚗 Rahul</div>
              <div className="absolute top-1/2 right-1/3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">🚗 Sanjay</div>
            </div>
          </div>

          {/* Cab List */}
          <div className="card-base overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Fleet Status</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mockCabs.map((cab) => (
                <div key={cab.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${cab.status === 'On Trip' ? 'bg-green-500' : 'bg-blue-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-900 font-mono">{cab.id}</p>
                      <p className="text-sm text-gray-600">{cab.driver}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cab.status === 'On Trip' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {cab.status}
                    </span>
                    {cab.status === 'On Trip' && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
                        <Navigation className="w-3 h-3" />
                        {cab.from} → {cab.to}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
