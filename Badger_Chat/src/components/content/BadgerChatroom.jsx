import React, { useContext, useEffect, useState, useRef } from "react";
import BadgerMessage from "./BadgerMessage";
import { Container, Row, Col, Pagination, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
  const [messages, setMessages] = useState([]);
  const [activePage, setActivePage] = useState([1]);
  const titleRef = useRef();
  const postRef = useRef();
  const [loginStatus] = useContext(BadgerLoginStatusContext);

  const loadMessages = () => {
    fetch(
      `https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${activePage}`,
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setMessages(json.messages || []);
      })
      .catch((err) => {
        setMessages([]);
      });
  };

  function handleCreatePost(e) {
    e.preventDefault();
    if (!loginStatus) {
      alert("You must be logged in to post!");
      return;
    }
    const title = titleRef.current.value;
    const content = postRef.current.value;
    if (!title || !content) {
      alert("You must provide both a title and content!");
      return;
    }
    fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    }).then((res) => {
      if (res.status === 200) {
        alert("Successfully posted!");
        titleRef.current.value = "";
        postRef.current.value = "";
        loadMessages();
      }
    });
  }

  useEffect(loadMessages, [props, activePage]);

  return (
    <Container>
      <h1>{props.name} Chatroom</h1>
      <hr />
      <Form onSubmit={handleCreatePost}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="postTitle">Post Title</Form.Label>
          <Form.Control
            type="text"
            id="postTitle"
            ref={titleRef}
            placeholder="Enter the title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="postContent">Post Content</Form.Label>
          <Form.Control
            type="textarea"
            id="postContent"
            rows={3}
            ref={postRef}
            placeholder="Enter the post content"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
      {messages.length > 0 ? (
        <Row>
          {messages.map((message) => (
            <Col key={message.id} xs={12} sm={6} md={4} lg={3}>
              <BadgerMessage
                id={message.id}
                title={message.title}
                poster={message.poster}
                content={message.content}
                created={message.created}
                onDelete={loadMessages}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Col>
          <p>There are no messages on this page yet!</p>
        </Col>
      )}
      <Pagination className="mt-4 justify-content-center">
        {[1, 2, 3, 4].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber == activePage}
            onClick={() => setActivePage(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}
