"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUserThunk } from "../redux/thunks/authThunks";
import type { AppDispatch, RootState } from "../redux/store";
import { validateEmail } from "../utils/validation";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.authR);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    if (!validateEmail(data.email)) {
      toast.error("Invalid email format");
      return;
    }

    const result = await dispatch(loginUserThunk(data));
    if (loginUserThunk.fulfilled.match(result)) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  validate: (value) =>
                    validateEmail(value) || "Invalid email format",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
