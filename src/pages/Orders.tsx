"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrdersThunk } from "../redux/thunks/orderThunks";
import { formatPrice } from "../utils/helpers";
import type { RootState, AppDispatch } from "../redux/store";
import { Loader2 } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orderR);
  const { userId } = useSelector((state: RootState) => state.authR);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrdersThunk(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">You don't have any orders yet.</p>
        <a
          href="/collection"
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.shippingAddress && (
                  <p className="text-sm text-gray-700 mt-1">
                    Recipient: {order.shippingAddress.fullName}
                  </p>
                )}
              </div>

              <div className="text-right mt-3 md:mt-0">
                <p className="font-semibold text-gray-700">
                  Total: {formatPrice(order.totalAmount)}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    order.status === "Confirmed"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  Status: {order.status}
                </p>
                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.productTitle} × {item.quantity}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
