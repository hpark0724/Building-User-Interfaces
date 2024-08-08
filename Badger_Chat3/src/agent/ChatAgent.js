const createChatAgent = () => {
  const CS571_WITAI_ACCESS_TOKEN = "TTASNRNAXOYI5F6PZTZ7TJQH3GWKWPVH";

  let availableItems = [];
  let cart = [];

  const handleInitialize = async () => {
    try {
      const response = await fetch("https://cs571.org/api/s24/hw10/items", {
        method: "GET",
        headers: {
          "X-CS571-ID":
            "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      availableItems = await response.json();
      return "Welcome to BadgerMart Voice! :) Type your question, or ask for help if you're lost!";
    } catch (er) {
      console.error(err);
      return "Sorry, There is a problem with the system. Please try again later.";
    }
  };

  const handleReceive = async (prompt) => {
    const resp = await fetch(
      "https://api.wit.ai/message?q=" + encodeURIComponent(prompt),
      {
        headers: {
          Authorization: "Bearer " + CS571_WITAI_ACCESS_TOKEN,
        },
      }
    );
    const data = await resp.json();

    console.log(data);
    const itemEntity = data.entities["item_type:item_type"];
    const numberEntity = data.entities["wit$number:number"];
    const priceEntity = data.entities["price_trigger:price_trigger"];
    const addEntity = data.entities["add_request:add_request"];
    const removeEntity = data.entities["remove_request:remove_request"];

    if (data.intents.length > 0) {
      switch (data.intents[0].name) {
        case "get_help":
          return getHelp();

        case "get_items":
          return getItems();

        case "get_price":
          if (priceEntity) {
            if (itemEntity) {
              return getPrice(itemEntity);
            } else {
              return "The item is not in stock.";
            }
          }

        case "add_item":
          if (addEntity) {
            if (itemEntity) {
              return addItems(itemEntity, numberEntity);
            } else {
              return "The item is not in stock.";
            }
          }

        case "remove_item":
          if (removeEntity) {
            if (itemEntity) {
              return removeItems(itemEntity, numberEntity);
            } else {
              return "The item is not in stock.";
            }
          }

        case "view_cart":
          if (cart.length === 0) {
            return "You have nothing in your cart, totaling $0.00";
          } else {
            return viewCartItems(cart);
          }
        case "checkout":
          return await checkoutCart();

        default:
          return "Sorry, I didn't get that. Type 'help' to see what you can do!";
      }
    }

    return "Sorry, I didn't get that. Type 'help' to see what you can do!";
  };

  const getHelp = () => {
    return (
      "In BadgerMart Voice, you can get the list of items, the price of an item, " +
      "add or remove an item from your cart, and checkout!"
    );
  };

  const getItems = () => {
    const items = availableItems.map((item) => item.name.toLowerCase());

    const listItemsMessage = `${items.slice(0, -1).join(", ")} and ${
      items[items.length - 1]
    }`;

    return `We have ${listItemsMessage} for sale!`;
  };

  const getPrice = (itemEntity) => {
    const itemName = itemEntity[0].value.toLowerCase();
    const item = availableItems.find(
      (item) => item.name.toLowerCase() === itemName
    );

    return `${itemName} costs $${item.price} each.`;
  };

  const addItems = (itemEntity, numberEntity) => {
    const itemName = itemEntity[0].value.toLowerCase();
    const item = availableItems.find(
      (item) => item.name.toLowerCase() === itemName
    );

    let itemQuantityAdd = 0;
    if (numberEntity && numberEntity[0] && numberEntity[0].value) {
      itemQuantityAdd = Math.floor(numberEntity[0].value);
    } else {
      itemQuantityAdd = 1;
    }
    if (itemQuantityAdd <= 0) {
      return "The quantity is invalid. Please input a positive number.";
    }

    for (let i = 0; i < itemQuantityAdd; i++) {
      cart.push(item);
    }

    return `Sure, adding ${itemQuantityAdd} ${itemName} to your cart.`;
  };

  const removeItems = (itemEntity, numberEntity) => {
    const itemName = itemEntity[0].value.toLowerCase();
    const itemInStock = availableItems.some(
      (item) => item.name.toLowerCase() === itemName
    );

    if (!itemInStock) {
      return "The item is not in stock.";
    }

    const itemInCart = cart.find(
      (item) => item.name.toLowerCase() === itemName
    );

    if (!itemInCart) {
      return "The item is not in your cart.";
    }

    let itemQuantityRemove = 0;
    if (numberEntity && numberEntity[0] && numberEntity[0].value) {
      itemQuantityRemove = Math.floor(numberEntity[0].value);
    } else {
      itemQuantityRemove = 1;
    }
    if (itemQuantityRemove <= 0) {
      return "The quantity is invalid. Please input a positive number.";
    }

    let itemCount = 0;
    cart.forEach((item) => {
      if (item.name.toLowerCase() === itemName) {
        itemCount += 1;
      }
    });

    const actualRemoveQuanity = Math.min(itemCount, itemQuantityRemove);

    let removeQuantity = 0;
    cart = cart.filter((item) => {
      if (
        item.name.toLowerCase() === itemName &&
        removeQuantity < actualRemoveQuanity
      ) {
        removeQuantity++;
        return false;
      }
      return true;
    });

    return `Sure, removing ${actualRemoveQuanity} ${itemName} from your cart.`;
  };

  const viewCartItems = (cart) => {
    const itemCounts = {};
    cart.forEach((item) => {
      if (itemCounts[item.name]) {
        itemCounts[item.name] += 1;
      } else {
        itemCounts[item.name] = 1;
      }
    });

    let itemDetails = "";

    Object.entries(itemCounts).forEach(([name, count], index, array) => {
      itemDetails += `${count} ${name.toLowerCase()}`;
      if (index < array.length - 1) {
        itemDetails += " and ";
      }
    });

    let totalPrice = cart
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);

    return `You have ${itemDetails} in your cart, totaling $${totalPrice}`;
  };

  const checkoutCart = async () => {
    if (cart.length === 0) {
      return "You don't have any items in your cart to purchase!";
    } else {
      try {
        let checkoutItemsCounts = {};

        availableItems.forEach((item) => {
          checkoutItemsCounts[item.name] = 0;
        });

        cart.forEach((item) => {
          checkoutItemsCounts[item.name]++;
        });

        const response = await fetch(
          "https://cs571.org/api/s24/hw10/checkout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CS571-ID":
                "bid_48398bcaa022a10b0f89f319621d249c62e4440da176996a65620ce44ce42d82",
            },
            body: JSON.stringify(checkoutItemsCounts),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          cart = [];
          return `Success! Your confirmation ID is ${responseData.confirmationId}`;
        } else {
          return "Sorry, There is a problem with the system. Please try again later.";
        }
      } catch (err) {
        return `${err.message}`;
      }
    }
  };

  return {
    handleInitialize,
    handleReceive,
  };
};

export default createChatAgent;
