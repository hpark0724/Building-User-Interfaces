import { useEffect, useState } from "react";
import BadgerSaleItem from "./BadgerSaleItem";
import { Col, Container, Row } from "react-bootstrap";

export default function BadgerMart(props) {
  const [saleItems, setSaleItems] = useState([]);
  const [featuredItem, setFeaturedItem] = useState([]);

  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw3/all-sale-items", {
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSaleItems(data);
        //  initialize featuredItem as the item in which featured is true
        const featuredItem = data.find((item) => item.featured == true);
        setFeaturedItem(featuredItem);
      });
  }, []);

  // display the text "Loading" when the featured item data is still fetching
  if (!featuredItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Badger Mart</h1>
      <p className="welcome">
        Welcome to our small-town mini mart located in Madison, WI!
      </p>
      <p>
        Today's featured Item is <b>{featuredItem.name}</b> for $
        {featuredItem.price}!
      </p>
      <Container>
        <Row>
          {saleItems.map((saleItem) => {
            return (
              <Col key={saleItem.name} xs={12} md={6} lg={4} xl={3}>
                <BadgerSaleItem
                  name={saleItem.name}
                  description={saleItem.description}
                  price={saleItem.price}
                  featured={saleItem.featured}
                />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}
