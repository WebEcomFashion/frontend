"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api/orderAPI";
import { Loader2 } from "lucide-react";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";
import axios from "axios";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(Number(orderId));
        setOrder(res);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Could not load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (!orderId || !order) {
        toast.error("Order not found.");
        return;
      }

      // So we send the amount in VND directly without multiplying by 26000
      const amountVND = Math.round(order.totalAmount);

      console.log(" Payment request with amount (VND):", amountVND);

      // Gọi API backend để lấy URL thanh toán VNPay
      const res = await axios.post(
        "http://localhost:5182/Payment/create-vnpay-url",
        {
          OrderId: order.id,
          Amount: amountVND,
          Name: order.shippingAddress.fullName,
          OrderDescription: `Payment for order #${order.id}`,
          OrderType: "other", // tùy theo type VNPay
          PaymentMethod: order.paymentMethod,
        }
      );

      const paymentUrl = res.data.paymentUrl;
      if (paymentUrl) {
        console.log(" Redirecting to VNPay:", paymentUrl);
        // Redirect sang VNPay
        window.location.href = paymentUrl;
      } else {
        toast.error("Failed to get payment URL.");
      }
    } catch (error) {
      console.error(" Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto border p-8 rounded-lg shadow-sm bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">
          Payment for Order #{order.id}
        </h1>

        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Amount:</strong> {formatPrice(order.totalAmount)}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          {order.shippingAddress && (
            <>
              <p>
                <strong>Recipient:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.street},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
            </>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
