import React, { useRef, useContext } from "react";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function BadgerLogin() {
  // TODO Create the login component.
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      alert("You must provide both a username and password!");
      return;
    }

    fetch("https://cs571.org/api/s24/hw6/login", {
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
        if (res.status === 200) {
          alert("Login was successful");
          setLoginStatus(true);
          sessionStorage.setItem("LoginSuccess", username);
          navigate("/");
        } else if (res.status === 401) {
          alert("Incorrect username or password!");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <h1>Login</h1>
      <Form onSubmit={handleLoginSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            ref={usernameRef}
            placeholder="Enter username"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            ref={passwordRef}
            placeholder="Enter password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
