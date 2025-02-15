import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Product = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Token value taken from the local storage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://products-backend-slgn.onrender.com/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      {products.map((product, key) => (
        <Card key={key} style={{ margin: "10px" }}>
          <Card.Img
            variant="top"
            style={{ height: "250px", width: "100%", objectFit: "contain",padding:"10px" }}
            src={product.url}
          />
          <Card.Body>
            <Card.Title>{product.title}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text className="text-success">
              Rating: {product.rating}
            </Card.Text>
            <div>
              <strong>Price: ₹{product.price}/-</strong>
            </div>
            <Button
              variant="primary"
              className="mt-2"
              onClick={() => onAddToCart(product)} // Call the function passed from App.js
            >
              Add to Cart
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Product;
