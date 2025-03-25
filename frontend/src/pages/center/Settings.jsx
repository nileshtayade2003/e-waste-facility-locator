import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";


const Settings = () => {
  const centerId = localStorage.getItem('centerId')
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", lat: "", lng: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/center/center/${centerId}`).then(({ data }) => setFormData(data.center));
  }, [centerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/center/center/${centerId}/update`, formData);
    alert("Details updated!");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if(!(passwords.oldPassword == passwords.newPassword)){

        const response = await axios.put(`http://localhost:5000/api/center/center/${centerId}/change-password`, passwords);
        if(response.data.success)
            alert("Password updated!");
        else
            alert('something went wrong or wrong old password')
    }else{
        alert('both passwords are same')
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    await axios.post(`http://localhost:5000/api/center/center/${centerId}/upload-image`, formData);
    alert("Image updated!");
  };

  return (
    <Container className="mb-5">
      <h2 className="my-4">Center Settings</h2>
      <Card className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Latitude</Form.Label>
                <Form.Control type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Longitude</Form.Label>
                <Form.Control type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">Save Changes</Button>
        </Form>
      </Card>

      <Card className="p-4 mt-4">
        <h4>Change Password</h4>
        <Form onSubmit={handlePasswordUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control type="password" name="oldPassword" onChange={handlePasswordChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" name="newPassword" onChange={handlePasswordChange} required />
          </Form.Group>
          <Button variant="danger" type="submit">Update Password</Button>
        </Form>
      </Card>

      <Card className="p-4 mt-4">
        <h4>Upload Image</h4>
        <Form onSubmit={handleImageUpload}>
          <Form.Group className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} accept="image/*" required />
          </Form.Group>
          {preview && <img src={preview} alt="Preview" className="img-fluid mb-3" style={{ maxWidth: "200px" }} />}
          <Button variant="info" type="submit">Upload Image</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Settings;
