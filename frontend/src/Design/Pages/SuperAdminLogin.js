// SuperAdminLogin.js
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";

function SuperAdminLogin() {
  // --- Login state ---
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // --- Store‐adding state ---
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    categories: [],
    password: "",
  });
  const [storeError, setStoreError] = useState("");
  const [storeSuccess, setStoreSuccess] = useState(false);

  const categoryOptions = [
    { value: "grocery", label: "Grocery" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Living" },
  ];

  // Login field change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLoginError("");
  };

  // Login submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;
    if (username === "admin" && password === "a") {
      setLoggedIn(true);
      window.alert("Login successful!");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  // Store form change (name, desc, password)
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
    setStoreError("");
    setStoreSuccess(false);
  };

  // Toggle category on/off
  const toggleCategory = (val) => {
    const cats = storeData.categories.includes(val)
      ? storeData.categories.filter((c) => c !== val)
      : [...storeData.categories, val];
    setStoreData({ ...storeData, categories: cats });
    setStoreError("");
    setStoreSuccess(false);
  };

  // Store form submit → POST to backend
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const { name, description, categories, password } = storeData;
    if (!name || !description || categories.length === 0 || !password) {
      setStoreError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3020/createStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });
      const text = await res.text();
      console.log("Response status:", res.status, "Body:", text);
      if (!res.ok) throw new Error(text || "Network response was not ok");

      setStoreSuccess(true);
      setStoreError("");
      setStoreData({ name: "", description: "", categories: [], password: "" });
    } catch (err) {
      console.error("Store creation failed:", err);
      setStoreError("Failed to create store: " + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          {loginError && <Alert variant="danger">{loginError}</Alert>}

          {!loggedIn && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>
              <Button type="submit" className="w-100">
                Log In
              </Button>
            </Form>
          )}

          {loggedIn && (
            <>
              <hr />
              <h4>Add a New Store</h4>
              {storeError && <Alert variant="danger">{storeError}</Alert>}
              {storeSuccess && (
                <Alert variant="success">Store added successfully!</Alert>
              )}

              <Form onSubmit={handleStoreSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Store Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={storeData.name}
                    onChange={handleStoreChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={storeData.description}
                    onChange={handleStoreChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  <ButtonGroup className="mb-2">
                    {categoryOptions.map((opt, i) => (
                      <ToggleButton
                        key={i}
                        id={`cat-${i}`}
                        type="checkbox"
                        variant={
                          storeData.categories.includes(opt.value)
                            ? "primary"
                            : "outline-primary"
                        }
                        checked={storeData.categories.includes(opt.value)}
                        onChange={() => toggleCategory(opt.value)}
                      >
                        {opt.label}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Store Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={storeData.password}
                    onChange={handleStoreChange}
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                  Add Store
                </Button>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SuperAdminLogin;
