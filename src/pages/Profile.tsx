"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchUserProfileThunk,
  updateUserProfileThunk,
} from "../redux/thunks/userThunks";
import type { AppDispatch, RootState } from "../redux/store";
import {
  validateEmail,
  validatePhoneNumber,
  validateName,
} from "../utils/validation";
import { toast } from "react-toastify";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.userR);
  const { userId } = useSelector((state: RootState) => state.authR);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.email || "");
      setValue("phoneNumber", user.phoneNumber || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!validateName(data.firstName)) {
      toast.error("First name must be at least 2 characters");
      return;
    }
    if (!validateName(data.lastName)) {
      toast.error("Last name must be at least 2 characters");
      return;
    }
    if (!validateEmail(data.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!validatePhoneNumber(data.phoneNumber)) {
      toast.error("Invalid phone number");
      return;
    }

    const result = await dispatch(
      updateUserProfileThunk({
        userId: userId || 0,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
    );

    if (result.payload) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 text-center text-sm mb-6">
                {user?.email}
              </p>

              <div className="space-y-2">
                <a
                  href="/orders"
                  className="block w-full text-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
                >
                  My Orders
                </a>
                <a
                  href="/change-password"
                  className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Change Password
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("firstName", {
                          required: "First name is required",
                          validate: (value) =>
                            validateName(value) ||
                            "First name must be at least 2 characters",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName", {
                          required: "Last name is required",
                          validate: (value) =>
                            validateName(value) ||
                            "Last name must be at least 2 characters",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        validate: (value) =>
                          validateEmail(value) || "Invalid email format",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        validate: (value) =>
                          validatePhoneNumber(value) || "Invalid phone number",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">First Name</p>
                      <p className="font-semibold text-gray-900">
                        {user?.firstName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Name</p>
                      <p className="font-semibold text-gray-900">
                        {user?.lastName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">
                      {user?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-900">
                      {user?.phoneNumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
