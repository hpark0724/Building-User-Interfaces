import { isLoggedIn } from "../Util";
import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createRegisterSubAgent = (end) => {
  let stage = "INITIAL";
  let username, password;

  const handleInitialize = async (promptData) => {
    if (await isLoggedIn()) {
      end(
        "You are currently logged in, please log out before logging in again!"
      );
      return;
    }
    stage = "GET_USERNAME";
    return {
      msg: "Got it! What username would you like to use?",
    };
  };

  const handleUsername = async (prompt) => {
    username = prompt;
    stage = "GET_PASSWORD";
    return {
      msg: "Thanks, what password would you like to use?",
      nextIsSensitive: true,
    };
  };

  const handlePassword = async (prompt) => {
    password = prompt;
    stage = "CONFIRM_PASSWORD";
    return {
      msg: "Lastly, please confirm your password.",
      nextIsSensitive: true,
    };
  };

  const handleConfirmPassword = async (prompt) => {
    if (password !== prompt) {
      stage = "INITIAL";
      return end({
        msg: "The passwords do not match. Registration has been cancelled.",
        emote: AIEmoteType.ERROR,
      });
    }

    try {
      const response = await fetch("https://cs571.org/api/s24/hw11/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(),
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const resp = await response.json();

      if (response.status === 200) {
        return end({
          msg: `Success! Your account has been registered. Welcome ${resp.user.username}.`,
          emote: AIEmoteType.SUCCESS,
        });
      } else {
        return end({
          msg: `${resp.msg}`,
          emote: AIEmoteType.ERROR,
        });
      }
    } catch (error) {
      return end({
        msg: "An error occurred during registration. Please try again later.",
        emote: AIEmoteType.ERROR,
      });
    }
  };

  const handleReceive = async (prompt) => {
    switch (stage) {
      case "GET_USERNAME":
        return handleUsername(prompt);
      case "GET_PASSWORD":
        return handlePassword(prompt);
      case "CONFIRM_PASSWORD":
        return handleConfirmPassword(prompt);
      default:
        stage = "GET_USERNAME";
        return end("An error occurred during registration. Please try again");
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createRegisterSubAgent;
