import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const UserPurchasesPage = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user._id) {
      fetchPurchasedProducts();
    }
  }, [user]);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user/purchases/${user._id}`);
      console.log(response.data)
      setPurchasedProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setPurchasedProducts([]);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4" style={{ marginTop: "70px" }}>My Purchases</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : purchasedProducts.length > 0 ? (
        <Row>
          {purchasedProducts.map((product) => (
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
                    <strong>Payment Mode:</strong> {product.paymentMode === 1 ? "Online" : "COD"} <br />
                    <strong>Status:</strong> {product.orderStatus === 2 ? "Delivered" : "On the way"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">You haven't purchased any products yet.</p>
      )}
    </Container>
  );
};

export default UserPurchasesPage;
