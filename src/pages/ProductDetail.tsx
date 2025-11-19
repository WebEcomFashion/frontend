"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetailThunk } from "../redux/thunks/productThunks";
import { addToCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading } = useSelector(
    (state: RootState) => state.productR
  );
  const isLoggedIn = useSelector(
    (state: RootState) => state.authR.authenticated
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetailThunk(Number.parseInt(id)));
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        id: Math.random(),
        productId: product.id,
        productTitle: product.productTitle,
        quantity,
        size: selectedSize,
        color: selectedColor,
        unitPrice: product.price,
      })
    );

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.info("Please login to checkout");
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        id: Math.random(),
        productId: product.id,
        productTitle: product.productTitle,
        quantity,
        size: selectedSize,
        color: selectedColor,
        unitPrice: product.price,
      })
    );

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !product.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
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

  const images =
    product.images && product.images.length > 0 ? product.images : [];
  const mainImage =
    images.length > 0
      ? images[selectedImageIndex]?.imageUrl
      : "/placeholder.svg";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-black">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/collection")}
            className="hover:text-black"
          >
            Collection
          </button>
          <span>/</span>
          <span className="text-black font-medium">{product.productTitle}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
              <img
                src={mainImage || "/placeholder.svg"}
                alt={product.productTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.productTitle}
            </h1>
            <p className="text-gray-600 mb-4">{product.brandName}</p>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {product.quantity > 0 ? (
                  <span className="text-green-600 font-medium">
                    In Stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Size
              </label>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-900 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="flex gap-3">
                {["Black", "White", "Red", "Blue", "Green", "Gray"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-900 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  }
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.quantity, quantity + 1))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium text-gray-900">Fashion</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Brand</p>
                  <p className="font-medium text-gray-900">
                    {product.brandName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
