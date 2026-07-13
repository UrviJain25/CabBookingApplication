import { Bell, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem('username') || 'User';
  const userEmail = localStorage.getItem('userEmail') || username;
  const customerName = localStorage.getItem('customerName');
  const displayName = customerName || username;
  const userRole = localStorage.getItem('userRole') || 'user';
  const profilePath = userRole === 'admin' ? '/admin/settings' : '/user/settings';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore errors
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 fixed left-64 right-0 top-0 z-20">
      <div />

      <div className="flex items-center space-x-6">
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{displayName}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => { setShowUserMenu(false); navigate(profilePath); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-2 text-red-600 rounded-b-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
