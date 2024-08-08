import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";

import CS571 from "@cs571/mobile-client";

export default function BadgerMart(props) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemNums, setItemNums] = useState({});

  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw7/items", {
      headers: {
        "X-CS571-ID":
          "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data));
  });

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, items.length - 1));
  };

  const addItem = (itemName) => {
    setItemNums((prevQuantity) => {
      const currQuantity = prevQuantity[itemName] || 0;
      const upperLimit = items.find(
        (item) => item.name === itemName
      ).upperLimit;
      const newQuantity =
        currQuantity < upperLimit ? currQuantity + 1 : upperLimit;
      return {
        ...prevQuantity,
        [itemName]: newQuantity,
      };
    });
  };

  const removeItem = (itemName) => {
    setItemNums((prevQuantity) => {
      const currQuantity = prevQuantity[itemName] || 0;
      const newQuantity = currQuantity > 0 ? currQuantity - 1 : 0;
      return {
        ...prevQuantity,
        [itemName]: newQuantity,
      };
    });
  };

  const totalDefault = { totalItems: 0, totalCost: 0 };

  const calculateTotals = () => {
    return items.reduce((totals, item) => {
      const itemQuantity = itemNums[item.name] || 0;
      return {
        totalItems: totals.totalItems + itemQuantity,
        totalCost: totals.totalCost + item.price * itemQuantity,
      };
    }, totalDefault);
  };

  const { totalItems, totalCost } = calculateTotals();

  const placeOrder = () => {
    Alert.alert(
      "Order Confirmed!",
      `Your order contains ${totalItems} items and would have cost $${totalCost.toFixed(
        2
      )}!`,
      [{ text: "OK", onPress: () => setItemNums({}) }]
    );
    setCurrentPage(0);
  };

  return (
    <View>
      <Text style={styles.title}>Welcome to Badger Mart!</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonStyle}>
          <Button
            title="PREVIOUS"
            onPress={prevPage}
            disabled={currentPage === 0}
            color="white"
          />
        </View>
        <View style={styles.buttonStyle}>
          <Button
            title="NEXT"
            onPress={nextPage}
            disabled={currentPage === items.length - 1}
            color="white"
          />
        </View>
      </View>
      {items.length > 0 && currentPage < items.length && (
        <BadgerSaleItem
          imgSrc={items[currentPage].imgSrc}
          name={items[currentPage].name}
          price={items[currentPage].price.toFixed(2)}
          upperLimit={items[currentPage].upperLimit}
          onAdd={() => addItem(items[currentPage].name)}
          onRemove={() => removeItem(items[currentPage].name)}
          itemQuantity={itemNums[items[currentPage].name] || 0}
        />
      )}
      <Text style={styles.orderDetailsText}>
        You have {totalItems} item(s) costing ${totalCost.toFixed(2)} in your
        cart!
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonStyle}>
          <Button
            title="PLACE ORDER"
            onPress={placeOrder}
            disabled={totalItems === 0}
            color="white"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: "#007AFF",
    marginHorizontal: 2,
    borderRadius: 5,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    margin: 20,
  },
  orderDetailsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});
