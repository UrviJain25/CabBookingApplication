import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Users, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { cabApi, bookingApi, CabResponseDto } from '../../services/api';

export default function BookRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedCab, setSelectedCab] = useState<CabResponseDto | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledTime, setScheduledTime] = useState('');

  const [availableCabs, setAvailableCabs] = useState<CabResponseDto[]>([]);
  const [loadingCabs, setLoadingCabs] = useState(false);
  const [cabError, setCabError] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Autocomplete suggestions
  const suggestedLocations = [
    'MG Road, Bengaluru',
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'Whitefield, Bengaluru',
    'Tech Park, Bengaluru',
    'Kempegowda International Airport',
    'Brigade Gateway, Bengaluru',
    'UB City, Bengaluru',
    'Bagmane Tech Park, Bengaluru',
    'Prestige Tech Park, Bengaluru',
    'Connaught Place, Delhi',
    'Bandra West, Mumbai',
    'Salt Lake, Kolkata',
  ];

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);

  // Fetch available cabs when pickup + dropoff are both set
  useEffect(() => {
    if (pickup && dropoff) {
      fetchAvailableCabs();
    }
  }, [pickup, dropoff]);

  const fetchAvailableCabs = async () => {
    setLoadingCabs(true);
    setCabError('');
    setSelectedCab(null);
    try {
      const res = await cabApi.getAvailable();
      setAvailableCabs(res.data);
    } catch {
      setCabError('Could not load available cabs. Please try again.');
    } finally {
      setLoadingCabs(false);
    }
  };

  const handlePickupChange = (value: string) => {
    setPickup(value);
    setPickupSuggestions(
      value.length > 0
        ? suggestedLocations.filter((l) => l.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const handleDropoffChange = (value: string) => {
    setDropoff(value);
    setDropoffSuggestions(
      value.length > 0
        ? suggestedLocations.filter((l) => l.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const cabTypeIcon: Record<string, string> = {
    Economy: '🚗',
    Premium: '🚙',
    SUV: '🚐',
    Luxury: '🏎️',
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff || !selectedCab) return;

    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      setBookingError('Could not find your customer ID. Please log out and log in again.');
      return;
    }

    setBooking(true);
    setBookingError('');

    try {
      const res = await bookingApi.book({
        customerId: parseInt(customerId),
        cabId: selectedCab.cabId,
        fromLocation: pickup,
        toLocation: dropoff,
      });
      setConfirmedBooking(res.data);
      setShowConfirmation(true);
      // Reset form
      setPickup('');
      setDropoff('');
      setSelectedCab(null);
      setPassengerCount(1);
      setAvailableCabs([]);
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'string') setBookingError(data);
      else if (data?.message) setBookingError(data.message);
      else setBookingError('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />

      {/* Booking Confirmation Modal */}
      {showConfirmation && confirmedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride Confirmed! ✓</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-gray-900 mb-3">Booking Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">#{confirmedBooking.tripBookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold text-gray-900">{confirmedBooking.fromLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold text-gray-900">{confirmedBooking.toLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-semibold text-gray-900">{confirmedBooking.driverName || 'Assigned shortly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cab:</span>
                  <span className="font-semibold text-gray-900 font-mono">{confirmedBooking.cabNumber}</span>
                </div>
                <div className="flex justify-between border-t border-blue-100 pt-2">
                  <span className="text-gray-600">Estimated Bill:</span>
                  <span className="font-bold text-primary">₹{confirmedBooking.bill?.toFixed(2) || '—'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book a Ride</h1>
            <p className="text-gray-600 mt-1">Choose your pickup, drop-off and cab</p>
          </div>

          {bookingError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {bookingError}
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-6">
            {/* Location Inputs */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pick your route</h2>
              <div className="space-y-4">
                {/* Pickup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => handlePickupChange(e.target.value)}
                      onBlur={() => setTimeout(() => setPickupSuggestions([]), 150)}
                      placeholder="Enter pickup location"
                      className="input-field pl-10"
                      required
                      autoComplete="off"
                    />
                    {pickupSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
                        {pickupSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => { setPickup(s); setPickupSuggestions([]); }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2 text-sm"
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropoff */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={dropoff}
                      onChange={(e) => handleDropoffChange(e.target.value)}
                      onBlur={() => setTimeout(() => setDropoffSuggestions([]), 150)}
                      placeholder="Enter drop-off location"
                      className="input-field pl-10"
                      required
                      autoComplete="off"
                    />
                    {dropoffSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
                        {dropoffSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => { setDropoff(s); setDropoffSuggestions([]); }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2 text-sm"
                          >
                            <Navigation className="w-4 h-4 text-gray-400" />
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* When + Passengers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">When</label>
                    <div className="flex gap-3">
                      {(['now', 'later'] as const).map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={t}
                            checked={scheduleType === t}
                            onChange={() => setScheduleType(t)}
                          />
                          <span className="text-gray-700 capitalize">{t === 'now' ? 'Now' : 'Schedule'}</span>
                        </label>
                      ))}
                    </div>
                    {scheduleType === 'later' && (
                      <div className="relative mt-3">
                        <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="datetime-local"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="input-field pl-10"
                          required={scheduleType === 'later'}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                        className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                      >
                        −
                      </button>
                      <div className="px-6 py-2 border-t border-b border-gray-300 text-center font-semibold min-w-[60px]">
                        {passengerCount}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
                        className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cab Selection */}
            {pickup && dropoff && (
              <div className="card-base p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Cab</h2>

                {cabError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {cabError}
                  </div>
                )}

                {loadingCabs ? (
                  <div className="py-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Finding available cabs...</p>
                  </div>
                ) : availableCabs.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-4xl mb-3">🚫</div>
                    <p className="text-gray-600 font-medium">No cabs available right now</p>
                    <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableCabs.map((cab) => (
                      <button
                        key={cab.cabId}
                        type="button"
                        onClick={() => setSelectedCab(cab)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedCab?.cabId === cab.cabId
                            ? 'border-primary bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <p className="text-3xl mb-2">{cabTypeIcon[cab.cabType] || '🚕'}</p>
                        <p className="font-semibold text-gray-900">{cab.carModel}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{cab.cabNumber}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded font-semibold ${
                          cab.cabType === 'Economy' ? 'bg-gray-100 text-gray-700' :
                          cab.cabType === 'Premium' ? 'bg-blue-100 text-blue-700' :
                          cab.cabType === 'SUV' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cab.cabType}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          <Users className="w-3 h-3 inline mr-1" />
                          {cab.capacity} seats
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Booking Summary */}
            {pickup && dropoff && selectedCab && (
              <div className="card-base p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ride Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup</span>
                    <span className="font-medium text-gray-900 text-right max-w-[240px]">{pickup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop-off</span>
                    <span className="font-medium text-gray-900 text-right max-w-[240px]">{dropoff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cab</span>
                    <span className="font-medium text-gray-900">{selectedCab.carModel} ({selectedCab.cabType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cab Number</span>
                    <span className="font-mono font-medium text-gray-900">{selectedCab.cabNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers</span>
                    <span className="font-medium text-gray-900">{passengerCount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </span>
                  ) : (
                    'Book Ride Now'
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Fare is calculated on the backend based on route
                </p>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
