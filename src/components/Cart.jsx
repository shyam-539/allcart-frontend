import React from "react";
import { Card, Button, ListGroup, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Your Shopping Cart</h2>
      {cart.length > 0 ? (
        <>
          <Card className="p-3 shadow-sm">
            <ListGroup variant="flush">
              {cart.map((item) => (
                <ListGroup.Item key={item._id} className="p-3">
                  <Row className="align-items-center">
                    {/* Product Image */}
                {console.log(cart)}
                    <Col xs={3} md={2}>
                      <img
                        src={item.url}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "80px", objectFit: "contain" }}
                      />
                    </Col>
                    {/* Product Details */}
                    <Col xs={6} md={6}>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="text-muted mb-1">Price: ₹{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}>
                          ➖
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity + 1)
                          }>
                          ➕
                        </Button>
                      </div>

                      <p className="text-success fw-bold mt-2">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </Col>
                    {/* Remove Button */}
                    <Col xs={3} md={4} className="text-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onRemoveFromCart(item._id)}>
                        ❌ Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Cart Summary */}
          <Card className="p-3 mt-3 shadow-sm">
            <h4>Total: ₹{totalPrice.toFixed(2)}</h4>
            <Button variant="success" className="w-100 mt-2">
              Proceed to Checkout
            </Button>
          </Card>

          {/* Continue Shopping Button */}
          <div className="text-center mt-3">
            <Link to="/product">
              <Button variant="outline-primary">← Continue Shopping</Button>
            </Link>
          </div>
        </>
      ) : (
        <p className="text-muted">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
