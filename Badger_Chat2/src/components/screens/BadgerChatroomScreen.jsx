import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { TextInput, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

function BadgerChatroomScreen(props) {
  const [data, setData] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [user, setUser] = useState(null);

  const loadData = () => {
    setRefreshPage(true);
    fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
      method: "GET",
      headers: {
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.messages);
        setRefreshPage(false);
      })
      .catch((err) => {
        console.error(err);
        setRefreshPage(false);
      });
  };

  const onRefresh = () => {
    loadData();
  };

  const handleCreatePost = () => {
    SecureStore.getItemAsync("token").then((token) => {
      fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CS571-ID":
            "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: postTitle, content: postContent }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.msg === "Successfully posted message!") {
            setPostTitle("");
            setPostContent("");
            setModalVisible(false);
            Alert.alert("Successfully posted!", "Successfully posted!");
            loadData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const handleDeletePost = async (id) => {
    SecureStore.getItemAsync("token").then((token) => {
      fetch(`https://cs571.org/api/s24/hw9/messages?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CS571-ID":
            "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.msg === "Successfully deleted message!") {
            Alert.alert("Alert", "Successfully deleted the post!");
            loadData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const findUser = () => {
    SecureStore.getItemAsync("token").then((token) => {
      fetch("https://cs571.org/api/s24/hw9/whoami", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CS571-ID":
            "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.isLoggedIn) {
            setUser(json.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  useEffect(() => {
    loadData();
    findUser();
  }, [props]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <BadgerChatMessage
            title={item.title}
            poster={item.poster}
            content={item.content}
            created={item.created}
            onDelete={handleDeletePost}
            signedUser={user ? user.username : null}
            id={item.id}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshPage} onRefresh={onRefresh} />
        }
      />
      {!props.notUser && (
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addPostButtonText}>ADD POST</Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.header}>Create A Post</Text>
          <Text style={styles.text}>Title</Text>
          <TextInput
            value={postTitle}
            onChangeText={setPostTitle}
            style={styles.titleContainer}
          />
          <Text style={styles.text}>Body</Text>
          <TextInput
            value={postContent}
            onChangeText={setPostContent}
            multiline
            style={styles.bodyContainer}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.buttonPost,
                postTitle && postContent ? styles.buttonEnabled : null,
              ]}
              disabled={!postTitle || !postContent}
              onPress={handleCreatePost}
            >
              <Text style={styles.buttonText}>CREATE POST</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPostButton: {
    backgroundColor: "crimson",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addPostButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    margin: 20,
  },
  bodyContainer: {
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    padding: 15,
    margin: 20,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonPost: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    marginRight: 10,
    shadowOffset: {
      width: 2,
      height: 1.5,
    },
    shadowOpacity: 0.2,
  },
  buttonCancel: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowOffset: {
      width: 2,
      height: 1.5,
    },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  buttonEnabled: {
    backgroundColor: "grey",
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
});

export default BadgerChatroomScreen;
