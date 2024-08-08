import { useState, useContext, useEffect } from "react";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import { Row, Col, Card, Button } from "react-bootstrap";

export default function BadgerBudsBasket(props) {
  // create and provide the context with BadgerBudsDataContext
  const budsData = useContext(BadgerBudsDataContext);
  // create state variable to save buds data list
  const [budsBasket, setBudsBasket] = useState([]);
  // store the array that excludes the cat with catID
  // and map it with bud.id
  const adoptedBudsList =
    JSON.parse(sessionStorage.getItem("adoptedCatIds")) || [];

  useEffect(() => {
    // store the saved cat ids, if there is no value save empty array
    const savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || [];
    // store the array of saved cat ids in the savedCatIds array
    const savedbuds = budsData.filter((bud) => savedCatIds.includes(bud.id));
    // update the saved data of buds data list
    setBudsBasket(savedbuds);
  }, [budsData]);

  const budUnselected = (catID, catName) => {
    // store the array that excludes the cat with catID
    const budsAvailable = budsBasket.filter((bud) => bud.id !== catID);
    // update list of state variable with the list without the unselected cats
    //setBudsBasket(budsAvailable);
    sessionStorage.setItem("savedCatIds", JSON.stringify(budsAvailable));
    alert(`${catName} has been removed from your basket!`);
  };

  const budAdopted = (catID, catName) => {
    // add the adopted cat id to the adoptedlist
    const adoptedBuds = [...adoptedBudsList, catID];
    // update adopted list with the list without the adopted cats
    sessionStorage.setItem("adoptedCatIds", JSON.stringify(adoptedBuds));

    const budsAvailable = budsBasket.filter((bud) => bud.id !== catID);

    // update saved cat id list by excluding the adopted cat
    setBudsBasket(budsAvailable);
    sessionStorage.setItem("savedCatIds", JSON.stringify(budsAvailable));
    alert(`${catName} has been adopted!`);
  };

  let budBasketInfo;

  // if there is no cat data in the My Basket page, show the message
  if (budsBasket.length == 0) {
    budBasketInfo = <p>You have no buds in your basket!</p>;
  } else {
    // if there exist at least one cat in the My Basket page
    // display cats details which are added to the basket
    budBasketInfo = (
      <Row>
        {budsBasket.map((bud) => (
          <Col key={bud.id} sm={12} md={6} lg={4} xl={3}>
            <Card className="mb-5">
              <Card.Img
                variant="top"
                src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${bud.imgIds[0]}`}
                alt={`A picture of ${bud.name}`}
                style={{ aspectRatio: "1 / 1" }}
              />
              <Card.Body>
                <Card.Title>{bud.name}</Card.Title>
                <Button
                  variant="primary"
                  onClick={() => budUnselected(bud.id, bud.name)}
                >
                  Unselect
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => budAdopted(bud.id, bud.name)}
                >
                  Adopt
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <div>
      <h1>Badger Buds Basket</h1>
      <p>These cute cats could be all yours!</p>
      {budBasketInfo}
    </div>
  );
}
