import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

export default function BadgerRegister() {
  // TODO Create the register component.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmedPassword] = useState("");

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (username === "" || password === "" || confirmPassword === "") {
      alert("You must provide both a username and password!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Your passwords do not match!");
      return;
    }
    fetch("https://cs571.org/api/s24/hw6/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 409) {
          alert("That username has already been taken!");
        } else if (res.status === 200) {
          alert("Registration was successful");
        } else {
          alert(res.msg);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <h1>Register</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            id="username"
            type="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="confirmPassword">Repeat Password</Form.Label>
          <Form.Control
            id="confirmPassword"
            type="password"
            placeholder="Repeat Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmedPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleRegisterSubmit}>
          Submit
        </Button>
      </Form>
    </>
  );
  //   Return a Bootstrap-styled form
}
