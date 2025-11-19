"use client";

import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createOrderThunk } from "../redux/thunks/orderThunks";
import { clearCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";
import { PAYMENT_METHODS } from "../utils/constants";
import axios from "axios";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, totalPrice } = useSelector(
    (state: RootState) => state.cartR
  );
  const { userId } = useSelector((state: RootState) => state.authR);
  const { loading } = useSelector((state: RootState) => state.orderR);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const orderData = {
        userId: userId || 0,
        totalAmount: totalPrice * 1.1,
        shippingAddress: {
          fullName: data.firstName + " " + data.lastName,
          email: data.email,
          phone: data.phoneNumber,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: "Vietnam", // nếu cần
        },
        paymentMethod: data.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productTitle: item.productTitle,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          size: item.size,
          color: item.color,
        })),
      };
      const result = await dispatch(createOrderThunk(orderData));

      if (!result.payload) {
        toast.error("Failed to create order");
        return;
      }

      toast.success("Order created successfully!");

      // 2️⃣ Nếu thanh toán VNPay, redirect sang PaymentResult
      if (data.paymentMethod === "VNPay") {
        navigate(`/payment/${result.payload.id}`);
        return;
      }

      // 3️⃣ Nếu phương thức khác, đi thẳng sang Order Confirmation
      navigate(`/order-confirmation/${result.payload.id}`);
    } catch (error) {
      console.error("[Checkout] error:", error);
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city", { required: "City is required" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      {...register("state", { required: "State is required" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    {...register("zipCode", {
                      required: "Zip code is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                      <input
                        type="radio"
                        value={value}
                        {...register("paymentMethod", {
                          required: "Payment method is required",
                        })}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing || loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.productTitle} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(totalPrice * 0.1)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(totalPrice * 1.1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
