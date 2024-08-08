import createChatDelegator from "./ChatDelegator";
import { isLoggedIn, getLoggedInUsername, logout } from "./Util";

const createChatAgent = () => {
  const CS571_WITAI_ACCESS_TOKEN = "7SG426HRJ2NNODRLUQYF4Q4EIZZ4TJYV";

  const delegator = createChatDelegator();

  let chatrooms = [];

  const handleInitialize = async () => {
    const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    });
    const data = await resp.json();
    chatrooms = data;

    return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
  };

  const handleReceive = async (prompt) => {
    if (delegator.hasDelegate()) {
      return delegator.handleDelegation(prompt);
    }
    const resp = await fetch(
      `https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`,
      {
        headers: {
          Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
        },
      }
    );
    const data = await resp.json();

    console.log("Received data from Wit.ai:", data);
    if (data.intents.length > 0) {
      switch (data.intents[0].name) {
        case "get_help":
          return handleGetHelp();
        case "get_chatrooms":
          return handleGetChatrooms();
        case "get_messages":
          return handleGetMessages(data);
        case "login":
          return handleLogin();
        case "register":
          return handleRegister();
        case "create_message":
          return handleCreateMessage(data);
        case "logout":
          return handleLogout();
        case "whoami":
          return handleWhoAmI();
      }
    }
    return "Sorry, I didn't get that. Type 'help' to see what you can do!";
  };

  const handleTranscription = async (rawSound, contentType) => {
    const resp = await fetch(`https://api.wit.ai/dictation`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
      },
      body: rawSound,
    });
    const data = await resp.text();
    const transcription = data
      .split(/\r?\n{/g)
      .map((t, i) => (i === 0 ? t : `{${t}`)) // Turn the response text into nice JS objects
      .map((s) => JSON.parse(s))
      .filter((chunk) => chunk.is_final) // Only keep the final transcriptions
      .map((chunk) => chunk.text)
      .join(" "); // And conjoin them!
    return transcription;
  };

  const handleSynthesis = async (txt) => {
    if (txt.length > 280) {
      return undefined;
    } else {
      const resp = await fetch(`https://api.wit.ai/synthesize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/wav",
          Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          q: txt,
          voice: "Rebecca",
          style: "soft",
        }),
      });
      const audioBlob = await resp.blob();
      return URL.createObjectURL(audioBlob);
    }
  };

  const handleGetHelp = async () => {
    const helpMessages = [
      "Try asking 'tell me the latest 3 messages', or ask for more help!",
      "Try asking 'register for an account', or ask for more help!",
    ];
    const randIndex = Math.floor(Math.random() * helpMessages.length);
    return helpMessages[randIndex];
  };

  const handleGetChatrooms = async () => {
    const chatroomList = chatrooms.join(", ");
    return `Of course, there are ${chatrooms.length} chatrooms: ${chatroomList}`;
  };

  const handleGetMessages = async (chatData) => {
    const num = chatData.entities["wit$number:number"];
    const numMessages = num
      ? parseInt(chatData.entities["wit$number:number"][0].value)
      : 1;
    const chatroomEntity = chatData.entities["chatrooms:chatrooms"];
    const chatroomName = chatroomEntity ? chatroomEntity[0].value : "";

    const resp = await fetch(
      `https://cs571.org/api/s24/hw11/messages?num=${numMessages}${
        chatroomName ? `&chatroom=${encodeURIComponent(chatroomName)}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      return data.msg;
    }
    if (data.messages && data.messages.length > 0) {
      return data.messages.map(
        (msg) =>
          `In ${msg.chatroom}, ${msg.poster} created a post titled '${msg.title}' saying '${msg.content}'`
      );
    } else {
      return ["There are no message in the chatroom."];
    }
  };

  const handleLogin = async () => {
    return await delegator.beginDelegation("LOGIN");
  };

  const handleRegister = async () => {
    return await delegator.beginDelegation("REGISTER");
  };

  const handleCreateMessage = async (chatData) => {
    const chatroomEntity = chatData.entities["chatrooms:chatrooms"];
    const chatroomName =
      chatroomEntity && chatroomEntity.length > 0
        ? chatroomEntity[0].value
        : undefined;

    return await delegator.beginDelegation(
      "CREATE",
      chatroomName ? { chatroom: chatroomName } : undefined
    );
  };

  const handleLogout = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        return "You are not logged in";
      } else {
        await logout();
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        return "You have been signed out.";
      }
    } catch (error) {
      return "Sorry, An error occurred during the logout process, Please try again later.";
    }
  };

  const handleWhoAmI = async () => {
    if (!(await isLoggedIn())) {
      return "You are not currently logged in.";
    }
    try {
      const loggedInUsername = await getLoggedInUsername();
      if (loggedInUsername) {
        return `You are currently logged in as ${loggedInUsername}.`;
      } else {
        return "Sorry, An error occured during retrieving your username. Please try again later.";
      }
    } catch (error) {
      return "Sorry, An error occurred during determining your login status. Please try again later.";
    }
  };

  return {
    handleInitialize,
    handleReceive,
    handleTranscription,
    handleSynthesis,
  };
};

export default createChatAgent;
