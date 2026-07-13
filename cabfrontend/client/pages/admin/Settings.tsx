import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Bell, Shield, Database, Palette, Save } from 'lucide-react';

export default function AdminSettings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

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
      <Sidebar role="admin" />
      <Header />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your admin preferences</p>
          </div>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg"><Bell className="w-5 h-5 text-primary" /></div>
                <h2 className="font-semibold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Get notified about new bookings</p>
                  </div>
                  <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Alerts</p>
                    <p className="text-sm text-gray-500">Receive daily summary emails</p>
                  </div>
                  <Toggle value={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
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
                <h2 className="font-semibold text-gray-900">Security</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>
            </div>

            {/* System */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg"><Database className="w-5 h-5 text-yellow-600" /></div>
                <h2 className="font-semibold text-gray-900">System Info</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Backend</span><span className="font-medium">Spring Boot 3.5 · Port 8080</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Database</span><span className="font-medium">MySQL 8.0</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Frontend</span><span className="font-medium">React 18 · Vite · TailwindCSS</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Version</span><span className="font-medium">FlexiRide v1.0</span></div>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
