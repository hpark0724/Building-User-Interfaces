import { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import CS571 from "@cs571/mobile-client";
import * as SecureStore from "expo-secure-store";
import BadgerChatroomScreen from "./screens/BadgerChatroomScreen";
import BadgerRegisterScreen from "./screens/BadgerRegisterScreen";
import BadgerLoginScreen from "./screens/BadgerLoginScreen";
import BadgerLandingScreen from "./screens/BadgerLandingScreen";
import BadgerLogoutScreen from "./screens/BadgerLogoutScreen";
import BadgerConversionScreen from "./screens/BadgerConversionScreen";

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [notUser, setNotUser] = useState(false);

  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw9/chatrooms", {
      method: "GET",
      headers: {
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
      },
    })
      .then((res) => res.json())
      .then((data) => setChatrooms(data))
      .catch((err) => console.error(err));
  }, []);

  function handleLogin(username, password) {
    fetch("https://cs571.org/api/s24/hw9/login", {
      method: "POST",
      headers: {
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.msg === "Successfully authenticated.") {
          SecureStore.setItemAsync("token", json.token);
          setIsLoggedIn(true);
        } else {
          Alert.alert("Login Failed", "Incorrect login, please try again.");
        }
      })
      .catch((err) => console.error(err));
  }

  function handleLogout() {
    SecureStore.deleteItemAsync("token").then(() => {
      setIsLoggedIn(false);
    });
    setNotUser(false);
    setIsRegistering(false);
  }

  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    // setIsLoggedIn(true); // I should really do a fetch to register first!
    fetch("https://cs571.org/api/s24/hw9/register", {
      method: "POST",
      headers: {
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.msg === "Successfully authenticated.") {
          SecureStore.setItemAsync("token", json.token).then(() => {
            setIsLoggedIn(true);
          });
        } else {
          Alert.alert("Signup Failed", "The account already exists");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const Stack = createStackNavigator();

  function NavigateRegister({ handleSignup, setIsRegistering, setIsLoggedIn }) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Register"
          component={BadgerRegisterScreen}
          initialParams={{
            handleSignup: handleSignup,
            setIsRegistering: setIsRegistering,
            setIsLoggedIn: setIsLoggedIn,
          }}
        />
      </Stack.Navigator>
    );
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => {
            return (
              <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            );
          })}
          <ChatDrawer.Screen name="Logout">
            {(props) => (
              <BadgerLogoutScreen {...props} handleLogout={handleLogout} />
            )}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return (
      <NavigationContainer>
        <NavigateRegister
          handleSignup={handleSignup}
          setIsRegistering={setIsRegistering}
          setIsLoggedIn={setIsLoggedIn}
        />
      </NavigationContainer>
    );
  } else if (notUser) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => {
            return (
              <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => (
                  <BadgerChatroomScreen name={chatroom} notUser={notUser} />
                )}
              </ChatDrawer.Screen>
            );
          })}
          <ChatDrawer.Screen name="Signup">
            {(props) => (
              <BadgerConversionScreen
                {...props}
                setIsRegistering={setIsRegistering}
                setNotUser={setNotUser}
              />
            )}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <BadgerLoginScreen
        handleLogin={handleLogin}
        setIsRegistering={setIsRegistering}
        setNotUser={setNotUser}
      />
    );
  }
}
