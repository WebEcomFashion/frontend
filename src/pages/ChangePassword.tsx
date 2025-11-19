"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { changePasswordThunk } from "../redux/thunks/userThunks";
import type { AppDispatch, RootState } from "../redux/store";
import { validatePassword } from "../utils/validation";
import { toast } from "react-toastify";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((state: RootState) => state.authR);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!data.oldPassword) {
      toast.error("Please enter your current password");
      return;
    }

    const passwordError = validatePassword(data.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        changePasswordThunk({
          userId: Number.parseInt(userId || "0"),
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        })
      );

      if (result.payload) {
        toast.success("Password changed successfully!");
        navigate("/profile");
      } else {
        toast.error(result.payload || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Change Password
        </h1>

        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 rounded-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("oldPassword", {
                      required: "Current password is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("newPassword", {
                    required: "New password is required",
                    validate: (value) => {
                      const result = validatePassword(value);
                      return result ? result : true; // ✅ Nếu có lỗi -> string, không lỗi -> true
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Min 6 chars, 1 uppercase, 1 number
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
