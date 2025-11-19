"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { adminAPI } from "../services/api/adminAPI";
import { formatPrice, formatDate } from "../utils/helpers";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import AdminProductManagement from "./AdminProductManagement";
import AdminUserManagement from "./AdminUserManagement";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  revenueThisMonth?: number;
  revenuePreviousMonth?: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useSelector((state: RootState) => state.authR);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "orders" | "products"
  >("overview");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (userRole !== "Admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        console.log(" Dashboard stats received:", response);
        setStats(response);
      } catch (error) {
        console.error(" Dashboard fetch error:", error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          {(["overview", "users", "orders", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition border-b-2 ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(stats?.totalRevenue || 0)}
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalOrders || 0}
                </p>
              </div>

              {/* Total Users */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>

              {/* Revenue Comparison */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  This Month vs Last Month
                </p>
                <div className="space-y-1">
                  <p className="text-sm">
                    This:{" "}
                    <span className="font-bold">
                      {formatPrice(stats?.revenueThisMonth || 0)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Last:{" "}
                    <span className="font-bold">
                      {formatPrice(stats?.revenuePreviousMonth || 0)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Previous Month",
                      revenue: stats?.revenuePreviousMonth || 0,
                    },
                    {
                      name: "This Month",
                      revenue: stats?.revenueThisMonth || 0,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#2563eb"
                    barSize={60}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && <AdminUserManagement />}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <AdminOrderManagement
            onViewOrder={(order) => {
              setSelectedOrder(order);
              setShowOrderModal(true);
            }}
          />
        )}

        {/* Products Tab */}
        {activeTab === "products" && <AdminProductManagement />}

        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">
                      #{selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900">
                      {selectedOrder.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(selectedOrder.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const AdminOrderManagement = ({
  onViewOrder,
}: {
  onViewOrder?: (order: any) => void;
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // THÊM: State để lưu tổng số trang
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10; // Định nghĩa PAGE_SIZE

  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Gọi API với page và PAGE_SIZE
        const response = await adminAPI.getAllOrders(page, PAGE_SIZE);
        // CẬP NHẬT LOGIC XỬ LÝ RESPONSE: Đọc các trường phân trang mới
        if (response && response.items) {
          setOrders(response.items);
          setTotalPages(response.totalPages || 1); // Lấy totalPages từ response
        } else if (Array.isArray(response)) {
          // Trường hợp dự phòng nếu API vẫn trả về mảng đơn thuần
          setOrders(response);
          setTotalPages(1);
        } else {
          setOrders([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error(" Orders fetch error:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]); // Dependency: page

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      console.log(" Status updated for order:", orderId, "to:", newStatus); // Refresh orders (Dùng page và perPage hiện tại để load lại đúng trang)
      const response = await adminAPI.getAllOrders(page, PAGE_SIZE);
      setOrders(response.items || []);
    } catch (error) {
      console.error(" Status update error:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // THÊM: Hàm xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.userId}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                    disabled={updatingOrderId === order.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-0 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => onViewOrder?.(order)}
                    className="text-black hover:text-gray-700 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* THÊM: Thanh chuyển trang (Pagination) */}
      {totalPages > 1 && (
        <div className="flex justify-end p-4 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 mr-2 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50 transition"
          >
            Previous
          </button>

          <span className="px-3 py-1 text-sm font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 ml-2 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
