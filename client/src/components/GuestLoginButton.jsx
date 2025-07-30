import React from "react";

const GuestLoginButton = ({ 
  userType, 
  onClick, 
  loading, 
  className = "" 
}) => {
  const isCustomer = userType === "customer";
  
  const buttonConfig = {
    customer: {
      bgColor: "bg-blue-500 hover:bg-blue-600",
      focusRing: "focus:ring-blue-500",
      icon: (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Login as Guest Customer"
    },
    staff: {
      bgColor: "bg-indigo-500 hover:bg-indigo-600",
      focusRing: "focus:ring-indigo-500",
      icon: (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      label: "Login as Guest Staff"
    }
  };

  const config = buttonConfig[userType];

  return (
    <button
      onClick={() => onClick(userType)}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-xl font-medium transition duration-200 transform ${
        loading
          ? "bg-gray-300 cursor-not-allowed text-gray-500"
          : `${config.bgColor} text-white hover:scale-105 hover:shadow-lg`
      } focus:outline-none focus:ring-2 ${config.focusRing} focus:ring-offset-2 ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging in...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {config.icon}
          {config.label}
        </div>
      )}
    </button>
  );
};

export default GuestLoginButton;
