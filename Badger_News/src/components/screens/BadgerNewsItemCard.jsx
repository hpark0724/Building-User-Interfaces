import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function BadgerNewsItemCard({
  title,
  img,
  fullArticleId,
  navigation,
}) {
  const imgURL = `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${img}`;

  const handlePress = () => {
    navigation.navigate("Article", { id: fullArticleId }); // navigate the article screen with the article id
  };

  // enable the article to be pressed to navigate to specific article page,
  // and show each articles with its image and title
  return (
    <View style={styles.card}>
      <Pressable onPress={handlePress}>
        <View style={styles.cardImage}>
          <Image source={{ uri: imgURL }} style={styles.image} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 1.5 },
    shadowOpacity: 0.4,
  },
  cardImage: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    height: 220,
  },
  title: {
    padding: 12,
    fontSize: 20,
  },
});
