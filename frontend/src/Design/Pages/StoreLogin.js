// StoreLogin.js
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function StoreLogin() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3020/loginStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || `Status ${res.status}`);
      }
      const { id } = await res.json();
      // store the storeId in localStorage
      localStorage.setItem("storeId", id);
      // redirect to your store dashboard (or wherever)
      navigate("/store-dashboard");
    } catch (err) {
      console.error("Store login failed:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          <h4>Store Login</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={creds.email}
                onChange={handleChange}
                placeholder="Enter store email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={creds.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>
            <Button type="submit" className="w-100">
              Log In to Store
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
