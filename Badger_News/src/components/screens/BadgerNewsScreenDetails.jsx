import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function BadgerNewsScreenDetails() {
  const route = useRoute();
  const ARTICLE_ID = route.params.id;
  const [articleData, setArticleData] = useState({});
  const [loading, setLoading] = useState(true);
  const fadeAnimation = new Animated.Value(0);

  useEffect(() => {
    fetch(`https://cs571.org/api/s24/hw8/article?id=${ARTICLE_ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setArticleData(data); // render the article details
        setLoading(false); // set loading to false when data is loaded
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // set loading to false when error is encountered
      });
  }, [ARTICLE_ID]);

  // when loading is done, load the additional content of the article
  // by fading in for 2 seconds
  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  // if it is set to loading, the screen shows the message with loading indicator
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1141f0" />
        <Text>The content is loading!</Text>
      </View>
    );
  }

  return (
    // show article details with its image, title, author, date, link and body with fade in animation
    <ScrollView>
      <Image
        source={{
          uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${articleData.img}`,
        }}
        style={styles.image}
      />
      <Animated.View style={{ opacity: fadeAnimation }}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{articleData.title}</Text>
          <Text style={styles.author}>
            By {articleData.author} on {articleData.posted}
          </Text>
          <Pressable onPress={() => Linking.openURL(articleData.url)}>
            <Text style={styles.link}>Read full article here.</Text>
          </Pressable>
          {articleData.body.map((bodyContent, index) => (
            <Text style={styles.body} key={index}>
              {bodyContent}
            </Text>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 23,
    marginVertical: 5,
    marginBottom: 20,
  },
  author: {
    fontSize: 16,
    marginVertical: -3,
  },
  contentText: {
    fontSize: 15,
    marginTop: 5,
  },
  link: {
    fontSize: 15,
    marginTop: 5,
    color: "#0fc5d9",
    marginVertical: 14,
  },
});
