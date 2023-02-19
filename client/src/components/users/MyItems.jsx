import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import LoadingSpinner from "../shared/LoadingSpinner";
import Listing from "../listing/Listing";
import AlertMsg from "../shared/AlertMsg";

function MyItems() {
  const { userData } = useContext(UserContext);
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();

  useEffect(() => {
    const getMyItems = () => {
      Axios.get(`/api/listings/listings-by-user?id=${userData.user.id}`)
        .then((res) => {
          setListings(res.data);
          setLoading(false);
        })
        .catch(() => {
          setMessage("Įvyko klaida. Pabandykite dar kartą vėliau");
          setLoading(false);
        });
    };

    getMyItems();
  }, [userData.user.id]);

  return loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : (
    <Container>
      <h2 className="pt-4 text-center">Mano skelbimai</h2>
      <Row className="my-4">
        {message ? (
          <Col>
            <AlertMsg
              message={message}
              variant="danger"
              clearError={() => {
                setMessage(undefined);
              }}
            />
          </Col>
        ) : null}
        {listings.length === 0 ? (
          <Col className="text-center">
            <h4>Dar neturite skelbimų</h4>
          </Col>
        ) : (
          listings.map((listing) => (
            <Listing
              title={listing.title}
              date={listing.date}
              desc={listing.desc}
              image={listing.image}
              location={listing.location}
              id={listing._id}
              key={listing._id}
            />
          ))
        )}
      </Row>
    </Container>
  );
};

export default MyItems;
