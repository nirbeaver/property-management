import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Building, FileText, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Leases', href: '/leases', icon: FileText },
    { name: 'Financial', href: '/financial', icon: DollarSign },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
            <h1 className="text-xl font-bold text-white">Property Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="flex flex-col px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {currentUser?.name.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
