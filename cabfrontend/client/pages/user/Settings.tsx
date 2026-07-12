import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Bell, Shield, Palette, Save, User } from 'lucide-react';

export default function UserSettings() {
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const username = localStorage.getItem('username') || '';
  const customerName = localStorage.getItem('customerName') || '';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <Header />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences</p>
          </div>

          <div className="space-y-4">
            {/* Profile Info */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg"><User className="w-5 h-5 text-primary" /></div>
                <h2 className="font-semibold text-gray-900">Profile</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {(customerName || username).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{customerName || 'User'}</p>
                  <p className="text-sm text-gray-500">@{username}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input type="text" defaultValue={customerName} placeholder="Your name" className="input-field" />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg"><Bell className="w-5 h-5 text-yellow-600" /></div>
                <h2 className="font-semibold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Ride updates and confirmations</p>
                  </div>
                  <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Alerts</p>
                    <p className="text-sm text-gray-500">Driver arrival and trip start alerts</p>
                  </div>
                  <Toggle value={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg"><Palette className="w-5 h-5 text-purple-600" /></div>
                <h2 className="font-semibold text-gray-900">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch to dark theme</p>
                </div>
                <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </div>
            </div>

            {/* Security */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg"><Shield className="w-5 h-5 text-green-600" /></div>
                <h2 className="font-semibold text-gray-900">Change Password</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Min 6 characters" className="input-field" />
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
