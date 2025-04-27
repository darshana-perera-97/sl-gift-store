import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";

function SuperAdminLogin() {
  // --- Login state ---
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // --- Stores list ---
  const [stores, setStores] = useState([]);
  const [storesError, setStoresError] = useState("");

  // --- Store-adding state ---
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    email: "",
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

  // — Login handlers —
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLoginError("");
  };
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

  // — Fetch stores —
  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:3020/stores");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setStores(data);
      setStoresError("");
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setStoresError("Could not load stores.");
    }
  };
  useEffect(() => {
    if (loggedIn) fetchStores();
  }, [loggedIn]);

  // — Store-form handlers —
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
    setStoreError("");
    setStoreSuccess(false);
  };
  const toggleCategory = (val) => {
    const cats = storeData.categories.includes(val)
      ? storeData.categories.filter((c) => c !== val)
      : [...storeData.categories, val];
    setStoreData({ ...storeData, categories: cats });
    setStoreError("");
    setStoreSuccess(false);
  };
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const { name, description, email, categories, password } = storeData;
    if (
      !name ||
      !description ||
      !email ||
      categories.length === 0 ||
      !password
    ) {
      setStoreError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3020/createStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Status ${res.status}`);
      }
      await res.json();
      setStoreSuccess(true);
      setStoreError("");
      setStoreData({
        name: "",
        description: "",
        email: "",
        categories: [],
        password: "",
      });
      fetchStores();
    } catch (err) {
      console.error("Store creation failed:", err);
      setStoreError("Failed to create store: " + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          {!loggedIn ? (
            <>
              {loginError && <Alert variant="danger">{loginError}</Alert>}
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
            </>
          ) : (
            <>
              <h4 className="mt-4">Available Stores</h4>
              {storesError && <Alert variant="danger">{storesError}</Alert>}
              {stores.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4 mb-4">
                  {stores.map((s) => (
                    <Col key={s.id}>
                      <Card>
                        <Card.Body>
                          <Card.Title>{s.name}</Card.Title>
                          <Card.Text>{s.description}</Card.Text>
                          <Card.Text>
                            <strong>Email:</strong> {s.email}
                          </Card.Text>
                          <Card.Text>
                            <strong>Categories:</strong>{" "}
                            {s.categories.join(", ")}
                          </Card.Text>
                          <Card.Text>
                            <small className="text-muted">
                              Created: {new Date(s.createdAt).toLocaleString()}
                            </small>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No stores available.</p>
              )}

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
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={storeData.email}
                    onChange={handleStoreChange}
                    placeholder="Store contact email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  <div>
                    {categoryOptions.map((opt) => (
                      <Form.Check
                        inline
                        key={opt.value}
                        type="checkbox"
                        id={`cat-${opt.value}`}
                        label={opt.label}
                        checked={storeData.categories.includes(opt.value)}
                        onChange={() => toggleCategory(opt.value)}
                      />
                    ))}
                  </div>
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
