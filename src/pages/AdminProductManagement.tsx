"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "../redux/store"
// Cần đảm bảo bạn đã định nghĩa kiểu ProductReadDto
// Nếu không có, có thể thay bằng 'any' hoặc định nghĩa Product interface
import type { ProductReadDto } from "../types/Product"
import { adminAPI } from "../services/api/adminAPI"
import { toast } from "react-toastify"

// Định nghĩa số lượng sản phẩm trên mỗi trang
const PAGE_SIZE = 10

const AdminProductManagement = () => {
  const { userRole } = useSelector((state: RootState) => state.authR)

  // *** STATE QUẢN LÝ DỮ LIỆU & PHÂN TRANG ***
  const [products, setProducts] = useState<ProductReadDto[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // *** STATE QUẢN LÝ FORM/CRUD ***
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    productTitle: "",
    description: "",
    price: "",
    quantity: "",
    brandName: "",
    categoryId: "1", // Giả sử CategoryId mặc định là "1"
    imageUrl: "",
  })

  // GỌI API KHI TRANG THAY ĐỔI
  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  // ------------------------------------
  // HÀM FETCH DỮ LIỆU CÓ PHÂN TRANG
  // ------------------------------------
  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)

      // Gửi currentPage và PAGE_SIZE lên API
      const response = await adminAPI.getAllProducts(page, PAGE_SIZE)

      // Xử lý response từ API (dạng { items: [...], totalPages: N, ... })
      setProducts(response.items || [])

      if (response.totalPages) {
        setTotalPages(response.totalPages)
      } else if (response.totalCount) {
        // Nếu API trả về tổng số lượng (TotalCount)
        setTotalPages(Math.ceil(response.totalCount / PAGE_SIZE))
      } else {
        setTotalPages(1)
      }
    } catch (error) {
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------
  // HÀM CHUYỂN TRANG
  // ------------------------------------
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // ------------------------------------
  // XỬ LÝ LƯU (THÊM/SỬA)
  // ------------------------------------
  const handleAddProduct = async () => {
    // Chuyển đổi dữ liệu sang đúng kiểu (number)
    const dataToSave = {
      productTitle: formData.productTitle,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      quantity: Number.parseInt(formData.quantity),
      categoryId: Number.parseInt(formData.categoryId),
      brandName: formData.brandName,
      imageUrl: formData.imageUrl
        ? {
            imageUrl: formData.imageUrl,
            displayOrder: 0,
          }
        : null,
      id: editingId,
    }

    try {
      if (editingId) {
        const updateData = {
          productTitle: formData.productTitle,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          quantity: Number.parseInt(formData.quantity),
          categoryId: Number.parseInt(formData.categoryId),
          brandName: formData.brandName,
          imageUrl: formData.imageUrl || "",
        }
        await adminAPI.updateProduct(editingId, updateData)
        toast.success("Product updated successfully")
      } else {
        await adminAPI.createProduct(dataToSave)
        toast.success("Product created successfully")
      }

      // Sau khi thành công: reset form, đóng form, và fetch lại dữ liệu
      setEditingId(null)
      setShowForm(false)
      // Sau khi thêm mới, nên quay về trang 1 để thấy sản phẩm mới
      // Nếu là sửa, ta giữ nguyên trang hiện tại
      fetchProducts(editingId ? currentPage : 1)
      setCurrentPage(editingId ? currentPage : 1)
    } catch (error) {
      console.error(" Save product error:", error)
      toast.error("Failed to save product")
    }
  }

  // ------------------------------------
  // XỬ LÝ CHỈNH SỬA
  // ------------------------------------
  const handleEditProduct = (product: ProductReadDto) => {
    // Gán dữ liệu sản phẩm vào form để chỉnh sửa
    setFormData({
      productTitle: product.productTitle,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      brandName: product.brandName,
      categoryId: product.categoryId.toString(),
      // Giả định product.images là mảng và lấy ảnh đầu tiên
      imageUrl: product.images?.[0]?.imageUrl || "",
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  // ------------------------------------
  // XỬ LÝ XÓA
  // ------------------------------------
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminAPI.deleteProduct(id)
        toast.success("Product deleted successfully")

        // Gọi lại API, giữ nguyên trang hiện tại (hoặc về trang trước nếu xóa hết items trên trang cuối)
        fetchProducts(currentPage)
      } catch (error) {
        console.error("Delete product error:", error)
        toast.error("Failed to delete product")
      }
    }
  }

  // *** LOGIC KIỂM TRA ROLE VÀ RENDER GIAO DIỆN ***

  if (userRole !== "Admin") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER VÀ NÚT THÊM MỚI */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <button
            onClick={() => {
              // Toggle form/Reset form data
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                productTitle: "",
                description: "",
                price: "",
                quantity: "",
                brandName: "",
                categoryId: "1",
                imageUrl: "",
              })
            }}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition shadow-md"
          >
            {showForm ? "Cancel" : "Add New Product"}
          </button>
        </div>

        {/* Form Add/Edit */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title"
                value={formData.productTitle}
                onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
                className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="border rounded px-3 py-2 col-span-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border rounded px-3 py-2 col-span-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              {editingId ? "Update Product" : "Create Product"}
            </button>
          </div>
        )}

        {/* Bảng sản phẩm */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.productTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.brandName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.price} đ</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* THANH CHUYỂN TRANG */}
            {totalPages > 1 && (
              <div className="flex justify-end p-4 border-t bg-white">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductManagement
