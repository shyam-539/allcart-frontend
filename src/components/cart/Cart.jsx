import React from "react";
import { Link } from "react-router-dom";
import "./cart.css";

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">🛒 Your Shopping Cart</h2>
        
        {cart.length > 0 ? (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div 
                  key={item._id}
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">Price: ₹{item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        >
                          ➖
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          ➕
                        </button>
                      </div>

                      <p className="font-medium text-green-600">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-red-700 px-3 py-1 rounded-full border border-red-500 hover:bg-red-50 transition-colors text-sm"
                      onClick={() => onRemoveFromCart(item._id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold">Total:</h4>
                <span className="text-2xl font-bold text-green-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors">
                Proceed to Checkout
              </button>
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <Link 
                to="/product"
                className="inline-block px-6 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
            <Link 
              to="/product"
              className="inline-block px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;