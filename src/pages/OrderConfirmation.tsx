"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderAPI } from "../services/api/orderAPI";
import { formatPrice, formatDate } from "../utils/helpers";
import { toast } from "react-toastify";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const response = await orderAPI.getOrderById(
            Number.parseInt(orderId)
          );
          setOrder(response);
        }
      } catch (error) {
        toast.error("Failed to load order");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Order Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-900">#{order.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-900">
                  {order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Shipping Address
            </h2>

            <div className="space-y-2 text-gray-900">
              <p className="font-semibold">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zipCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>

          <div className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.productTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color} | Qty:{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12 max-w-md ml-auto">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount * 0.909)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(order.totalAmount * 0.091)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate("/collection")}
            className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
