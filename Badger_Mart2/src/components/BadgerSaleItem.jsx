import React, { useState } from "react";

export default function BadgerSaleItem(props) {
  // initialize the internal state of quantity
  const [quantity, setQuantity] = useState(0);

  // increase quantity by one
  function increQuantity() {
    setQuantity(quantity + 1);
  }

  //decrement quantity by one
  function decreQuantity() {
    setQuantity(quantity - 1);
  }

  return (
    // apply saleItem.featured css class if it is featured item, else
    // apply saleItem css class
    <div className={`saleItem ${props.featured ? "featured" : ""}`}>
      {/* display its name, price and description */}
      <h2>{props.name}</h2>
      <p className="description">{props.description}</p>
      <p className="price">${props.price}</p>
      <div>
        <button
          className="inline"
          // call decreQuantity function when - button is clicked
          onClick={decreQuantity}
          disabled={quantity === 0}
        >
          -
        </button>
        <p className="inline">{quantity}</p>
        {/* call decreQuantity function when - button is clicked */}
        <button onClick={increQuantity} className="inline">
          +
        </button>
      </div>
    </div>
  );
}
