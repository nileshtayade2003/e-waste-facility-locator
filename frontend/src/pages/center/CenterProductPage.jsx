import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const CenterProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    photo: null
  });

  const centerId = localStorage.getItem('centerId')

  // Fetch center products
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/center/products/${centerId}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("centerId", centerId);
    formDataToSend.append("photo", formData.photo);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/center/products/create",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProducts([...products, response.data.product]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header with Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Products</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Product Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={`http://localhost:5000/${product.photo}`}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.status === 1 ? "Sold" : "Available"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for Adding Product */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CenterProductPage;
