import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const registerUser = () => {
    if (!username) {
      setWarningMessage("Please enter a username.");
      return;
    }
    if (!password || !confirmPassword) {
      setWarningMessage("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      setWarningMessage("Passwords do not match!");
      return;
    }
    setWarningMessage("");
    props.route.params.handleSignup(username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join BadgerChat!</Text>
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
      <Text>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
      />
      <Text style={styles.warningMessage}>{warningMessage}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSignup}>
          <TouchableOpacity
            color="white"
            style={styles.buttonSignup}
            onPress={registerUser}
          >
            <Text style={styles.buttonText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonNeverMind}>
          <TouchableOpacity
            color="white"
            buttonColor="grey"
            onPress={() => props.route.params.setIsRegistering(false)}
          >
            <Text style={styles.buttonText}>NEVERMIND!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  title: {
    fontSize: 35,
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    width: "60%",
    marginBottom: 20,
    marginVertical: 8,
    paddingVertical: 8,
    borderWidth: 1,
  },
  buttonSignup: {
    backgroundColor: "crimson",
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 15,
    marginLeft: 15,
  },
  buttonNeverMind: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    width: "40%",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  warningMessage: {
    color: "red",
    fontSize: 14,
    marginBottom: 16,
    marginTop: 5,
  },
});

export default BadgerRegisterScreen;
