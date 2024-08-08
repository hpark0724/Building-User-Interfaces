import { Text, View, Image, StyleSheet, Button } from "react-native";

export default function BadgerSaleItem(props) {
  const { imgSrc, name, price, upperLimit, itemQuantity, onAdd, onRemove } =
    props;

  return (
    <View style={styles.container}>
      {imgSrc ? <Image style={styles.image} source={{ uri: imgSrc }} /> : <></>}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>${price} each</Text>
      <Text style={styles.upperLimit}>
        You can order up to {upperLimit} units!
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonStyle}>
          <Button
            title="-"
            onPress={onRemove}
            disabled={itemQuantity <= 0}
            color="white"
          />
        </View>
        <Text style={styles.itemNum}>{itemQuantity}</Text>
        <View style={styles.buttonStyle}>
          <Button
            title="+"
            onPress={onAdd}
            disabled={itemQuantity >= upperLimit}
            color="white"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 250,
    height: 200,
  },
  name: {
    fontSize: 48,
    textAlign: "center",
    marginVertical: 10,
  },
  price: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  upperLimit: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemNum: {
    fontSize: 18,
  },
  buttonStyle: {
    backgroundColor: "#007AFF",
    marginHorizontal: 10,
    borderRadius: 3,
  },
});
