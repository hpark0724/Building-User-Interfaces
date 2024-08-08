import { Button, Card, Carousel } from "react-bootstrap";
import React, { useState } from "react";

const BadgerBudSummary = ({ bud, saveBud }) => {
  // useState variable to read the details fo buddy and setShowDetail to show the details
  const [showDetail, setShowDetail] = useState(false);

  // intialize the array for image urls
  const imgURLs = [];
  // use for loop to loop through and store the image urls
  for (const CAT_IMG_ID of bud.imgIds) {
    const url = `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${CAT_IMG_ID}`;
    imgURLs.push(url);
  }

  // function that will be called when the user clicks "Show More" button
  const buddyShowDetail = () => {
    setShowDetail(!showDetail);
  };

  // initialize variable to store the elements needed to display cats details
  let budImages;
  let budInfo;
  let primaryButton;
  let secButton = (
    <Button variant="secondary" onClick={() => saveBud(bud.id, bud.name)}>
      Save
    </Button>
  );
  // if "Show More" button is not clicked (default page),
  // show the first single picture with "Show More" and "Save" buttons
  if (!showDetail) {
    budImages = (
      <img
        className="d-block w-100"
        src={imgURLs[0]}
        alt={`A picture of ${bud.name}`}
        style={{ aspectRatio: "1 / 1" }}
      />
    );
    budInfo = null;
    primaryButton = (
      <Button variant="primary" onClick={buddyShowDetail}>
        Show More
      </Button>
    );
  }
  // if the user clicks "Show More" button,
  // show multiple pictures (using react bootstrap carousel)
  // with cat's information, "Show Less" and "Save" buttons
  else if (showDetail) {
    budImages = (
      <Carousel interval={null}>
        {imgURLs.map((imageUrl, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={imageUrl}
              alt={`A picture of ${bud.name}`}
              style={{ aspectRatio: "1 / 1" }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    );
    budInfo = (
      <>
        <Card.Subtitle className="mb-4 text-muted">{bud.gender}</Card.Subtitle>
        <Card.Subtitle className="mb-4 text-muted">{bud.breed}</Card.Subtitle>
        <Card.Text>{bud.age}</Card.Text>
        <Card.Text>{bud.description}</Card.Text>
      </>
    );
    primaryButton = (
      <Button variant="primary" onClick={buddyShowDetail}>
        Show Less
      </Button>
    );
  }

  // use react bootstrap card component to display the cat's information
  return (
    <Card className="mb-5">
      {budImages}
      <Card.Body>
        <Card.Title>{bud.name}</Card.Title>
        {budInfo}
        {primaryButton}
        {secButton}
      </Card.Body>
    </Card>
  );
};

export default BadgerBudSummary;
