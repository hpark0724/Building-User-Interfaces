import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {
  const dt = new Date(props.created);
  const [userPost, setUserPost] = useState(
    sessionStorage.getItem("LoginSuccess")
  );
  const isUserPost = userPost === props.poster;

  const handleDeletePost = () => {
    fetch(`https://cs571.org/api/s24/hw6/messages?id=${props.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    }).then((res) => {
      if (res.status === 200) {
        alert("Successfully deleted the post!");
        props.onDelete(props.id);
      } else {
        console.error("Error deleting the post");
      }
    });
  };

  return (
    <Card style={{ margin: "0.5rem", padding: "0.5rem" }}>
      <h2>{props.title}</h2>
      <sub>
        Posted on {dt.toLocaleDateString()} at ${dt.toLocaleTimeString()}
      </sub>
      <br />
      <i>{props.poster}</i>
      <p>{props.content}</p>
      {isUserPost ? (
        <Button variant="danger" onClick={handleDeletePost}>
          Delete Post
        </Button>
      ) : (
        <></>
      )}
    </Card>
  );
}
export default BadgerMessage;
