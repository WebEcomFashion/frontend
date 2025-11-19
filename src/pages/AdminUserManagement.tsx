"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import type { UserReadDto } from "../types/User";
import { adminAPI } from "../services/api/adminAPI";
import { toast } from "react-toastify";

// Định nghĩa số lượng người dùng trên mỗi trang
const PAGE_SIZE = 10; 

const AdminUserManagement = () => {
  const { userRole } = useSelector((state: RootState) => state.authR);
  
  // 1. THÊM STATE CHO PHÂN TRANG (PAGINATION)
  const [users, setUsers] = useState<UserReadDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // GỌI API KHI TRANG THAY ĐỔI HOẶC LẦN ĐẦU LOAD
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]); // Re-fetch khi currentPage thay đổi

  // 2. CẬP NHẬT HÀM fetchUsers
  // Thêm tham số 'page' để xác định trang cần lấy
  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      // Gửi currentPage và PAGE_SIZE lên API
      const response = await adminAPI.getAllUsers(page, PAGE_SIZE);
      console.log(" Users data received:", response);
      
      // Giả định API trả về tổng số trang (hoặc TotalCount)
      setUsers(response.items || response || []); 

      if (response.totalPages) {
        setTotalPages(response.totalPages);
      } else if (response.totalCount) {
        // Nếu API trả về tổng số lượng (TotalCount)
        setTotalPages(Math.ceil(response.totalCount / PAGE_SIZE));
      } else {
         // Trường hợp xấu nhất, nếu API không trả về thông tin phân trang
         setTotalPages(1); 
      }
      
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(" User fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success("User deleted successfully");
        // Gọi lại API, giữ nguyên trang hiện tại
        fetchUsers(currentPage); 
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  if (userRole !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h4>User Management</h4>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.Id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{`${user.firstName || "N/A"} ${
                      user.lastName || "N/A"
                    }`}</td>
                    <td className="px-6 py-4">{user.email || "N/A"}</td>
                    <td className="px-6 py-4">{user.phoneNumber || "N/A"}</td>
                    <td className="px-6 py-4">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.Id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* 3. THÊM THANH CHUYỂN TRANG */}
            {totalPages > 1 && (
              <div className="flex justify-end p-4 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mr-2 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 text-sm font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 ml-2 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;