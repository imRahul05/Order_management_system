import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    if (user?.role === 'customer') {
      navigate('/customer/profile');
    } else if (user?.role === 'staff') {
      navigate('/staff/profile');
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = () => {
    const name = user?.username || user?.name || 'U';
    return name.charAt(0).toUpperCase();
  };

return (
    <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold">
                        OMS
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Hide "Browse Products" for staff */}
                    {(!isAuthenticated || user?.role !== 'staff') && (
                        <Link 
                            to="/products" 
                            className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Browse Products
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'customer' && (
                                <>
                                   
                                    <Link 
                                        to="/customer/cart" 
                                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Cart
                                    </Link>
                                </>
                            )}
                            
                            {user?.role === 'staff' && (
                                <Link 
                                    to="/staff/dashboard" 
                                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}

                            {/* Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" alt={user?.username || user?.name} />
                                        <AvatarFallback className="bg-blue-800 text-white">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block">{user?.username || user?.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                <div className="font-medium">{user?.username || user?.name}</div>
                                                <div className="text-xs text-gray-500">{user?.email}</div>
                                              
                                            </div>
                                            
                                            <button
                                                onClick={handleProfileClick}
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>
                                            
                                            {user?.role === 'customer' && (
                                                <Link
                                                    to="/customer/orders"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    My Orders
                                                </Link>
                                            )}
                                            
                                            <div className="border-t">
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    </nav>
);
};

export default Navbar;
