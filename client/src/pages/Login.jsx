import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { redirectByRole } from "../utils/roleCheck";
import GuestLoginButton from "../components/GuestLoginButton";
import FormInput from "../components/FormInput";
import { loginInputFields } from "../utils/formConfigs";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState({
    form: false,
    customer: false,
    staff: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const redirectPath = from === "/" ? redirectByRole(result.user) : from;
      navigate(redirectPath, { replace: true });
    }

    setLoading(prev => ({ ...prev, form: false }));
  };

  const handleGuestLogin = async (userType) => {
    setLoading(prev => ({ ...prev, [userType]: true }));

    const guestCredentials = {
      customer: {
        email: "customer@gmail.com",
        password: "customer@gmail.com",
      },
      staff: {
        email: "staff@gmail.com",
        password: "staff@gmail.com",
      },
    };

    const credentials = guestCredentials[userType];
    const result = await login(credentials.email, credentials.password);

    if (result.success) {
      const redirectPath =
        userType === "staff" ? "/staff/dashboard" : "/customer/products";
      navigate(redirectPath, { replace: true });
    }

    setLoading(prev => ({ ...prev, [userType]: false }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
      
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your Order Management account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {loginInputFields.map((field) => (
                <FormInput
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  icon={field.icon}
                />
              ))}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading.form}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition duration-200 transform ${
                  loading.form
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading.form ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-200 hover:underline"
                >
                  Create one here
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Guest Login Options */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">
            Quick Demo Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GuestLoginButton
              userType="customer"
              onClick={handleGuestLogin}
              loading={loading.customer}
            />
            <GuestLoginButton
              userType="staff"
              onClick={handleGuestLogin}
              loading={loading.staff}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Demo accounts with pre-populated data for testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
