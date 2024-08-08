import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import BadgerBudSummary from "./BadgerBudSummary";
import { useState, useEffect } from "react";

import { useContext } from "react";
import { Row, Col } from "react-bootstrap";

export default function BadgerBudsAdoptable(props) {
  // create and provide the context with BadgerBudsDataContext
  const budsData = useContext(BadgerBudsDataContext);
  // create state variable to track saved cats IDs
  const [savedIds, setSavedIds] = useState([]);
  const adoptedCatIds = JSON.parse(
    sessionStorage.getItem("adoptedCatIds") || "[]"
  );

  // store the cats data without the cats that are saved(moved to basket) or adopted
  const budsAvailable = budsData.filter(
    (bud) => !savedIds.includes(bud.id) && !adoptedCatIds.includes(bud.id)
  );

  // function that saves a cat id to a sessionStorage
  const saveBud = (catId, catName) => {
    const basketSaveIds = [...savedIds, catId];
    setSavedIds(basketSaveIds); // save cat's id and info in the
    sessionStorage.setItem("savedCatIds", JSON.stringify(basketSaveIds));
    alert(`${catName} has been added to your basket!`);
  };

  // load cats saved ids (from sessionStorage) corresponding to 'savedCatIDs' key
  useEffect(() => {
    const catIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || [];
    setSavedIds(catIds); // update saved cats ids to the savedIds array variable
  }, [budsData]);

  useEffect(() => {
    console.log("budsData :", budsData);
    console.log("Saved IDs:", savedIds);
    console.log("Adopted IDs:", adoptedCatIds);
    console.log("budsAvailable IDs:", budsAvailable);
  }, [savedIds, adoptedCatIds, budsAvailable, budsData]);

  let budAdoptableInfo;

  // if all the cats are saved and there are no cats in the Available Cat page
  if (budsAvailable.length == 0) {
    budAdoptableInfo = <p>No buds are available for adoption!</p>;
    // if there exist at least one cat in the Available Cat page
  } else {
    budAdoptableInfo = (
      <Row>
        {budsAvailable.map((bud) => {
          // show the cats information that is not yet saved and moved to the basket
          if (!savedIds.includes(bud.id)) {
            return (
              <Col key={bud.id} sm={12} md={6} lg={4} xl={3}>
                {/* call BadgerBudSummary function for displaying the cats information */}
                <BadgerBudSummary bud={bud} saveBud={saveBud} />
              </Col>
            );
            // if saved, remove the cats information from the Available Cat Page
          } else {
            return null;
          }
        })}
      </Row>
    );
  }

  return (
    <div>
      <h1>Available Badger Buds</h1>
      <p>The following cats are looking for a loving home! Could you help?</p>
      {budAdoptableInfo}
    </div>
  );
}
