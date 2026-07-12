import { useState } from 'react';
import { authApi, customerApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Car, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

type Tab = 'login' | 'register';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [tab, setTab] = useState<Tab>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({
        username: email,
        password: password,
      });

      const loginData = response.data;
      console.log('Login response:', loginData);

      // Backend returns role as "ADMIN" or "CUSTOMER"
      const backendRole = loginData.role?.toUpperCase();
      const effectiveRole = backendRole === 'ADMIN' ? 'admin' : 'user';

      // Use role from role-selection screen if it was admin-selected
      const finalRole = role === 'admin' && effectiveRole === 'admin' ? 'admin'
        : role === 'user' && effectiveRole === 'user' ? 'user'
        : effectiveRole;

      localStorage.setItem('userRole', finalRole);
      localStorage.setItem('username', loginData.username || email);
      localStorage.setItem('userEmail', loginData.username || email);

      if (loginData.customerId != null) {
        localStorage.setItem('customerId', String(loginData.customerId));
      }

      if (finalRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        if (typeof error.response.data === 'string') {
          setError(error.response.data);
        } else if (error.response.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        setError('Unable to connect to server. Make sure the backend is running on port 8080.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await customerApi.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        address: regAddress,
        username: regUsername,
        password: regPassword,
      });

      setSuccess('Registration successful! Please log in.');
      setTab('login');
      setEmail(regUsername);
      // Reset register form
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegAddress('');
      setRegUsername('');
      setRegPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (data.errors) {
          setError(Object.values(data.errors).join(', '));
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Registration failed. Please check your details.');
        }
      } else {
        setError('Unable to connect to server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary rounded-lg p-3 shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FlexiRide</h1>
            <p className="text-gray-600">Select your account type to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setRole('admin')}
              className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Admin Dashboard</div>
                  <p className="text-sm text-gray-600">Manage bookings, drivers, and fleet</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setRole('user')}
              className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <span className="text-2xl">🚕</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">User Account</div>
                  <p className="text-sm text-gray-600">Book rides and track your journeys</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-primary rounded-lg p-3 shadow-lg">
              <Car className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FlexiRide</h1>
          <p className="text-gray-600 text-sm mt-1">
            {role === 'admin' ? '🛡️ Admin Portal' : '🚕 User Portal'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Tabs - only show for user role */}
          {role === 'user' && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === 'login'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === 'register'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Success / Error banners */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter username"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className="input-field pl-9 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9876543210"
                      className="input-field pl-9 text-sm"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-9 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Your address"
                    className="input-field pl-9 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="username"
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="input-field pr-9 text-sm"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setRole(null);
              setError('');
              setSuccess('');
              setTab('login');
            }}
            className="text-sm text-primary hover:underline"
          >
            ← Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
}
