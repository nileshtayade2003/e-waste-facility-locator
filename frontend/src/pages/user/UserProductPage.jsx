import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Pagination, Spinner, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
const key = import.meta.env.VITE_RAZORPAY_KEY;



const UserProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState(""); // Store address input
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/user/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCOD = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/update-product-order", {
        productId: selectedProduct._id,
        userId: user._id,
        paymentMode: 0, // COD
        status: 1, // Sold
        orderStatus: 1, // On Way
        address, // Include address
      });

      if (response.data.success) {
        alert("Order placed successfully with Cash on Delivery!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error placing COD order:", error);
      alert("Failed to place order.");
    }

    setShowModal(false);
    setAddress(""); // Reset address input
  };

  const handleOnlinePayment = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay. Please check your internet connection.");
      return;
    }

    try {
      const amount = selectedProduct.price * 100;
      const orderResponse = await axios.post("http://localhost:5000/api/user/razorpay/order", { amount });
      const { id: order_id, amount: orderAmount, currency } = orderResponse.data;

      const options = {
        key: key,
        amount: orderAmount,
        currency,
        name: "E-Waste Store",
        description: `Payment for ${selectedProduct.name}`,
        order_id,
        handler: async function (response) {
          try {
            document.body.style.overflow = "auto";

            const saveOrderResponse = await axios.post("http://localhost:5000/api/user/update-product-order", {
              productId: selectedProduct._id,
              userId: user._id,
              paymentMode: 1, // Online Payment
              status: 1, // Sold
              orderStatus: 1, // On Way
              paymentId: response.razorpay_payment_id,
              address, // Include address
            });

            if (saveOrderResponse.data.success) {
              alert("Payment Successful! Order placed.");
              fetchProducts();
            }
          } catch (error) {
            console.error("Error saving order:", error);
            alert("Payment successful, but failed to save order.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal closed");
            document.body.style.overflow = "auto";
          },
        },
      };

      document.body.style.overflow = "hidden";
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Please try again.");
      document.body.style.overflow = "auto";
    }

    setShowModal(false);
    setAddress(""); // Reset address input
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4" style={{ marginTop: "70px" }}>Available Products</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {products.length > 0 ? (
              products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <Col md={4} key={product._id} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/${product.photo}`}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        <strong>Price:</strong> ₹{product.price} <br />
                        <strong>Posted by:</strong> {product.centerId?.name || "Unknown"} <br />
                        <strong>Email:</strong> {product.centerId?.email || "Not available"}
                      </Card.Text>
                      {user ? (
                        <>
                           <Button variant="success" onClick={() => handleBuyNow(product)}>
                            Buy Now
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="success" onClick={() => navigate('/login')}>
                            Buy Now
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">No products available.</p>
            )}
          </Row>

          {products.length > itemsPerPage && (
            <Pagination className="justify-content-center">
              {[...Array(Math.ceil(products.length / itemsPerPage)).keys()].map((page) => (
                <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" className="me-2" onClick={handleOnlinePayment}>
            Pay Online
          </Button>
          <Button variant="secondary" onClick={handleCOD}>
            Cash on Delivery
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserProductPage;
