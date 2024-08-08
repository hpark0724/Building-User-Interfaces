import { Text, TouchableOpacity, StyleSheet } from "react-native";
import BadgerCard from "./BadgerCard";

function BadgerChatMessage(props) {
  const dt = new Date(props.created);
  return (
    <BadgerCard
      style={{
        marginTop: 16,
        padding: 8,
        marginLeft: 8,
        marginRight: 8,
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity: 0.25,
        backgroundColor: "#F0EAF4",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: 600 }}>{props.title}</Text>
      <Text style={{ fontSize: 12 }}>
        by {props.poster} | Posted on {dt.toLocaleDateString()} at
        {dt.toLocaleTimeString()}
      </Text>
      <Text></Text>
      <Text>{props.content}</Text>
      {props.signedUser === props.poster ? (
        <TouchableOpacity
          style={styles.buttonDeletePost}
          onPress={() => props.onDelete(props.id)}
        >
          <Text style={styles.text}>DELETE POST</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </BadgerCard>
  );
}
const styles = StyleSheet.create({
  buttonDeletePost: {
    backgroundColor: "crimson",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
export default BadgerChatMessage;
