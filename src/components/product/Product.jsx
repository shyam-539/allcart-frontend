import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const Product = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const navigate = useNavigate();

  // Existing fetch and filter logic remains the same
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://allcart-backend.onrender.com/api/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProducts();
  }, [token, navigate]);

  // Filter logic remains the same
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under500":
          result = result.filter((product) => product.price < 500);
          break;
        case "500-1000":
          result = result.filter(
            (product) => product.price >= 500 && product.price <= 1000
          );
          break;
        case "over1000":
          result = result.filter((product) => product.price > 1000);
          break;
        default:
          break;
      }
    }

    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      result = result.filter((product) => product.rating >= minRating);
    }

    setFilteredProducts(result);
  }, [searchTerm, priceFilter, ratingFilter, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-black px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-black">Our Products</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Price Filter */}
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 bg-white rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Price Range (All)</option>
            <option value="under500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="over1000">Over ₹1000</option>
          </select>

          {/* Rating Filter */}
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 bg-white rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Rating (All)</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-black">No products found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative pt-[100%]">
                  <img
                    src={product.url}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 right-4 bg-black text-white px-2 py-1 rounded-full text-sm font-medium">
                    ★ {product.rating}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-black">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;