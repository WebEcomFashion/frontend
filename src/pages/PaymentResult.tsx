"use client";

import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../redux/slices/cartSlice"; // ✅ thêm dòng này
import type { AppDispatch } from "../redux/store";

const PaymentResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const vnpTxnRef = searchParams.get("vnp_TxnRef");

        if (!orderId) throw new Error("Order ID missing");

        if (vnpResponseCode === "00") {
          toast.success("Payment successful!");

          // ✅ Xóa giỏ hàng
          dispatch(clearCart());
          await new Promise((r) => setTimeout(r, 200)); // đợi re-render Redux
          // ✅ Chuyển sang trang xác nhận đơn hàng
          navigate(`/order-confirmation/${orderId}`);
        } else {
          toast.error("Payment failed or cancelled");
          navigate("/checkout");
        }
      } catch (err) {
        console.error("VNPay result error:", err);
        toast.error("Payment processing failed");
        navigate("/checkout");
      }
    };

    checkPayment();
  }, [orderId, navigate, searchParams, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 text-lg">Processing payment...</p>
    </div>
  );
};

export default PaymentResult;
