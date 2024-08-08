import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

function BadgerLoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BadgerChat Login</Text>
      <Text>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <View style={styles.buttonLogin}>
        <TouchableOpacity
          color="white"
          style={styles.buttonLogin}
          onPress={() => props.handleLogin(username, password)}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>New here?</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSignup}>
          <TouchableOpacity
            color="white"
            style={styles.buttonSignup}
            onPress={() => props.setIsRegistering(true)}
          >
            <Text style={styles.buttonText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonGuest}>
          <TouchableOpacity
            color="white"
            buttonColor="grey"
            onPress={() => props.setNotUser(true)}
          >
            <Text style={styles.buttonText}>CONTINUE AS GUEST</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 35,
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    width: "60%",
    marginBottom: 30,
    marginVertical: 8,
    paddingVertical: 8,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 25,
  },
  buttonLogin: {
    backgroundColor: "darkred",
    borderRadius: 5,
    marginRight: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  buttonSignup: {
    backgroundColor: "grey",
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
    flex: 1,
  },
  buttonGuest: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    marginTop: 15,
    textAlign: "center",
  },
});

export default BadgerLoginScreen;
