"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsThunk } from "../redux/thunks/productThunks";
import type { AppDispatch, RootState } from "../redux/store";
import ProductCard from "../components/ProductCard";
import { setPage } from "../redux/slices/productSlice";

const Collection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, totalPages, page } = useSelector(
    (state: RootState) => state.productR
  );
  const [sortBy, setSortBy] = useState("newest");
  const [filterPrice, setFilterPrice] = useState<[number, number]>([
    0, 10000000000000000,
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProductsThunk({ page, perPage: 20 }));
  }, [dispatch, page, sortBy]);

  const filteredProducts = products
    .filter((product) => {
      const matchesPrice =
        product.price >= filterPrice[0] && product.price <= filterPrice[1];
      const matchesSearch =
        product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return +b.id - +a.id;
        case "newest":
        default:
          return +b.id - +a.id;
      }
    });

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-gray-600">
            Discover our latest fashion collection
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterPrice[0]}
                    onChange={(e) =>
                      setFilterPrice([
                        Number.parseInt(e.target.value) || 0,
                        filterPrice[1],
                      ])
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterPrice[1]}
                    onChange={(e) =>
                      setFilterPrice([
                        filterPrice[0],
                        Number.parseInt(e.target.value) || 10000000,
                      ])
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {filterPrice[0]} - {filterPrice[1]}
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            page === pageNum
                              ? "bg-black text-white"
                              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
