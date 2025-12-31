import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
      visible: true
    },
    {
      name: 'My Tasks',
      path: '/tasks',
      icon: '📋',
      visible: true
    },
    {
      name: 'Create Task',
      path: '/tasks/new',
      icon: '➕',
      visible: true
    },
    {
      name: 'User Management',
      path: '/users',
      icon: '👥',
      visible: user?.role === 'admin'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-screen shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-xl shadow-lg">
            <span className="text-2xl">✓</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <p className="text-xs text-indigo-300">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.filter(item => item.visible).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
                : 'hover:bg-indigo-700/50 hover:translate-x-1'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <div className="bg-indigo-800/50 rounded-lg p-3 text-center">
          <p className="text-xs text-indigo-300 mb-1">Need Help?</p>
          <button className="text-sm font-medium hover:text-indigo-200 transition">
            📚 Documentation
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;