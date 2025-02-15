import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, InputGroup, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react';
import '../product.css';

const Product = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://allcart-backend.onrender.com/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under500":
          result = result.filter(product => product.price < 500);
          break;
        case "500-1000":
          result = result.filter(product => product.price >= 500 && product.price <= 1000);
          break;
        case "over1000":
          result = result.filter(product => product.price > 1000);
          break;
        default:
          break;
      }
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      result = result.filter(product => product.rating >= minRating);
    }

    setFilteredProducts(result);
  }, [searchTerm, priceFilter, ratingFilter, products]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col md={12} lg={4}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search size={20} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} lg={4}>
          <Form.Select 
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="mb-3"
          >
            <option value="all">Price Range (All)</option>
            <option value="under500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="over1000">Over ₹1000</option>
          </Form.Select>
        </Col>
        <Col md={6} lg={4}>
          <Form.Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="mb-3"
          >
            <option value="all">Rating (All)</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </Form.Select>
        </Col>
      </Row>

      {filteredProducts.length === 0 ? (
        <div className="text-center mt-5">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product._id}>
              <Card className="h-100 shadow-sm hover-shadow transition-all">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.url}
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      padding: "1rem"
                    }}
                  />
                  <span className="position-absolute top-0 end-0 bg-primary text-white px-2 py-1 m-2 rounded-pill">
                    ★ {product.rating}
                  </span>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h5 mb-2">{product.name}</Card.Title>
                  <Card.Text className="text-muted mb-3 flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-primary">₹{product.price}/-</h4>
                    <Button
                      variant="outline-primary"
                      onClick={() => onAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Product;