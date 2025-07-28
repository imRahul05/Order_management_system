import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                            <span className="text-sm">
                                Welcome, {user?.username || user?.name} ({user?.role})
                            </span>
                            
                            {user?.role === 'customer' && (
                                <>
                                    <Link 
                                        to="/customer/products" 
                                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        My Products
                                    </Link>
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
                            
                            <button
                                onClick={handleLogout}
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
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
