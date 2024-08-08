import { isLoggedIn } from "../Util";

const createPostSubAgent = (end) => {
  const CS571_WITAI_ACCESS_TOKEN = "7SG426HRJ2NNODRLUQYF4Q4EIZZ4TJYV";

  let stage = "ASK_CHATROOM";

  let chatroomName, title, content;
  let chatrooms = [];

  const fetchAvailableChatrooms = async () => {
    const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
      headers: { "X-CS571-ID": CS571.getBadgerId() },
      credentials: "include",
    });
    if (!resp.ok) {
      throw new Error("Failed to fetch chatrooms");
    }
    chatrooms = await resp.json();
  };

  const postMessage = async (chatroomName, title, content) => {
    const resp = await fetch(
      `https://cs571.org/api/s24/hw11/messages?chatroom=${encodeURIComponent(
        chatroomName
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(),
        },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      }
    );

    if (resp.ok) {
      return { success: true, data: await resp.json() };
    } else {
      const errorResp = await resp.json();
      return {
        success: false,
        status: resp.status,
        message: errorResp.msg,
      };
    }
  };

  // Function to initialize the post creation process
  const handleInitialize = async (promptData) => {
    if (!(await isLoggedIn())) {
      return end(
        "You need to be logged in to create a post. Please log in first."
      );
    }

    try {
      await fetchAvailableChatrooms();

      if (
        promptData &&
        promptData.chatroom &&
        chatrooms.includes(promptData.chatroom)
      ) {
        chatroomName = promptData.chatroom;
        stage = "ASK_TITLE";
        return "What would you like the title of your post to be?";
      } else {
        stage = "ASK_CHATROOM";
        return "Which chatroom would you like to post in?";
      }
    } catch (error) {
      return end("Failed to fetch chatrooms. Please try again later.");
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "ASK_CHATROOM":
        const witResponse = await fetch(
          `https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`,
          {
            headers: {
              Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
            },
          }
        );
        const chatData = await witResponse.json();
        const chatroomEntity = chatData.entities["chatrooms:chatrooms"];

        if (chatroomEntity && chatroomEntity.length > 0) {
          chatroomName = chatroomEntity[0].value;
          stage = "ASK_TITLE";
          return "Sounds good. What would you like the title of your post to be?";
        } else {
          stage = "RETRY";
          return "The chatroom does not exist. Would you like to try another chatroom to create a post? (yes/no)";
        }
      case "RETRY":
        if (prompt.toLowerCase() === "yes") {
          stage = "ASK_CHATROOM";
          return "Please type in a chatroom you would like to make a post";
        } else {
          return end("Posting a message has been cancelled.");
        }
      case "ASK_TITLE":
        title = prompt;
        stage = "ASK_CONTENT";
        return "What would you like to say in your post?";
      case "ASK_CONTENT":
        content = prompt;
        stage = "CONFIRM";
        return `Excellent! To confirm, you want to create a post titled '${title}' in ${chatroomName}?`;
      case "CONFIRM":
        if (prompt.toLowerCase() === "yes") {
          const { success, message } = await postMessage(
            chatroomName,
            title,
            content
          );
          if (success) {
            return end(`All set! Your post has been made in ${title}.`);
          } else {
            return end(`Sorry, An error occurred during creating your post`);
          }
        } else {
          return end(
            "No problem, if you change your mind just ask me to create a post again!"
          );
        }
      default:
        return "An error occured while creating your post";
    }
  };
  return {
    handleInitialize,
    handleReceive,
  };
};

export default createPostSubAgent;
