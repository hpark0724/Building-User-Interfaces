import { isLoggedIn, ofRandom } from "../Util";
import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createLoginSubAgent = (end) => {
  let stage;
  let username, password;

  const handleInitialize = async (promptData) => {
    if (await isLoggedIn()) {
      return end(
        "You are currently logged in, please logout before logging in again!"
      );
    } else {
      stage = "FOLLOWUP_USERNAME";
      return ofRandom([
        "Got it! What is your username?",
        "Great! What is your username?",
      ]);
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "FOLLOWUP_USERNAME":
        return await handleUsername(prompt);
      case "FOLLOWUP_PASSWORD":
        return await handlePassword(prompt);
      //   default:
      //     return "I didn't catch that. Can you say it again?";
    }
  };

  const handleUsername = async (prompt) => {
    username = prompt;
    stage = "FOLLOWUP_PASSWORD";

    return {
      msg: "Great! What is your password?",
      nextIsSensitive: true,
    };
  };

  const handlePassword = async (prompt) => {
    password = prompt;

    const resp = await fetch("https://cs571.org/api/s24/hw11/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (resp.status === 200) {
      const data = await resp.json();
      return end({
        msg: `Logged in! Welcome ${data.user.username}.`,
        emote: AIEmoteType.SUCCESS,
      });
    } else {
      stage = "FOLLOWUP_USERNAME";
      return end({
        msg: `Sorry, your username and password is incorrect.`,
        emote: AIEmoteType.ERROR,
      });
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createLoginSubAgent;
