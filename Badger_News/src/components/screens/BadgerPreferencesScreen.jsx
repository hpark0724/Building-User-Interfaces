import { Text, View, Switch, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useBadgerPreferences } from "./BadgerPreferencesContext";

function BadgerPreferencesScreen(props) {
  const { prefs, setPrefs } = useBadgerPreferences();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw8/articles", {
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const articleTags = filterTags(data);
        setTags(articleTags); // render the article tags

        const prefsState = {};
        articleTags.forEach((tag) => {
          prefsState[tag] = true; // set all tags to true (enable all switches at the initial state)
        });
        setPrefs(prefsState); // Update the preferences state with the initialized preferences
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setPrefs]);

  const filterTags = (items) => {
    const tags = new Set();
    // iterate over each data and add its tags to the set
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tags.add(tag); // add the tag to the set
      });
    });
    return [...tags]; // convert set to array
  };

  const toggleSwitch = (tag) => {
    setPrefs((prevPrefs) => ({
      ...prevPrefs, // copy of previous preferences state to retain
      [tag]: !prevPrefs[tag], // flip the state of selected tag
    }));
  };

  return (
    // set each box with its statement with tag and switch
    <ScrollView>
      <View style={styles.screen}>
        <Text style={styles.header}>Preferences</Text>
        {tags.map((tag, index) => (
          <View key={index} style={styles.preference}>
            <Text style={styles.containerText}>
              {"Currently"}
              <Text style={prefs[tag] ? styles.containerText : styles.tag}>
                {prefs[tag] ? "" : " NOT"}
              </Text>
              {" showing "}
              <Text style={styles.tag}>{`${tag} `}</Text>
              {"articles."}
            </Text>
            <View style={styles.switch}>
              <Switch // switch and its design
                trackColor={{ false: "#767577", true: "#fad2d2" }}
                thumbColor={prefs[tag] ? "#ff0000" : "#6b6a6b"}
                onValueChange={() => toggleSwitch(tag)}
                value={prefs[tag]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    width: "100%",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 30,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  preference: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 1.5 },
    shadowOpacity: 0.4,
    backgroundColor: "#ffffff",
  },
  containerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  tag: {
    fontWeight: "bold",
  },
  switch: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default BadgerPreferencesScreen;
