import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

function BadgerConversionScreen(props) {
  const handleSignupSwitch = () => {
    props.setNotUser(false);
    props.setIsRegistering(true);
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginTop: -100 }}>Ready to signup?</Text>
      <Text>Join BadgerChat to be able to make posts!</Text>
      <Text />
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignupSwitch}
      >
        <Text style={styles.text}>SIGNUP!</Text>
      </TouchableOpacity>
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
  signupButton: {
    backgroundColor: "darkred",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowOffset: {
      width: 2,
      height: 1.5,
    },
    shadowOpacity: 0.4,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BadgerConversionScreen;
