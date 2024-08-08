import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import BadgerNewsItemCard from "./BadgerNewsItemCard";
import { useNavigation } from "@react-navigation/native";
import { useBadgerPreferences } from "./BadgerPreferencesContext";

function BadgerNewsScreen(props) {
  const navigation = useNavigation();
  const [articles, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const { prefs } = useBadgerPreferences();

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
        setArticle(data); // render the article data
        setLoading(false); // set loading to false when data is loaded
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // set loading to false when error is encountered
      });
  }, []);

  const filteredArticles = articles.filter(
    // when preferences object is empty (default), all articles are included
    // else, filter articles that matches at least one of the tag
    (article) =>
      Object.keys(prefs).length === 0 || article.tags.every((tag) => prefs[tag])
  );

  // if it is set to loading, the screen shows the message with loading indicator
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1141f0" />
        <Text>The content is loading!</Text>
      </View>
    );
  }

  // display filtered articles with preferences, if none show the message
  return (
    <ScrollView>
      <Text style={styles.header}>Articles</Text>
      {filteredArticles.length > 0 ? (
        filteredArticles.map((article) => (
          <BadgerNewsItemCard
            key={article.id.toString()}
            title={article.title}
            img={article.img}
            fullArticleId={article.fullArticleId}
            navigation={navigation}
          />
        ))
      ) : (
        <Text style={styles.message}>
          There are no articles to be displayed!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 25,
    marginTop: 30,
    textAlign: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 30,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
});

export default BadgerNewsScreen;
