"use client";

import type React from "react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";
import type { ProductReadDto } from "../types/Product";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: ProductReadDto;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(
    (state: RootState) => state.authR.authenticated
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "/diverse-fashion-display.png";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-64">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={product.productTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.quantity < 5 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.productTitle}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {product.brandName}
        </p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Size and Color Selection */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            >
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Color
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            >
              <option>Black</option>
              <option>White</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Gray</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm"
          >
            Save
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
