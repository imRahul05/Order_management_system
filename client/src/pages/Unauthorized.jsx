import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this resource.
          </p>
        </div>
        
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 inline-block"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
