import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Link,
  Navigate,
  Route,
} from "react-router-dom";
import Home from "./components/home/Home";
import Product from "./components/product/Product";
import Cart from "./components/cart/Cart";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Load Cart from Local Storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    // Check if user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Save Cart to Local Storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Handle Login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("token");
  };

  // Handle Adding to Cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      let updatedCart = [...prevCart];
      const existingProductIndex = updatedCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex !== -1) {
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
        };
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    setSuccessMessage(`${product.name} added to cart!`);
    setTimeout(() => setSuccessMessage(""), 1000);
  };

  // Handle removing products from cart
  const handleRemoveFromCart = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
  };

  // Handle updating product quantity
  const handleUpdateQuantity = (_id, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === _id
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
          <div className="container-fluid">
            <ul className="navbar-nav me-auto p-2">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <Link className="nav-link" to="/product">
                    Products
                  </Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li>
                    <button 
                      className="nav-link" 
                      onClick={handleLogout}
                      style={{ background: 'none', border: 'none' }}
                    >
                      Logout
                    </button>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      Cart
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/product" /> : 
                <Home onLogin={handleLogin} />
            } 
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Product onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Cart
                  cart={cart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      
      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default App;