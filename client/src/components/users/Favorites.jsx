import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import { isDefined, isNullable } from "../../utils/null-checks";
import LoadingSpinner from "../shared/LoadingSpinner";
import Listing from "../listing/Listing";
import AlertMsg from "../shared/AlertMsg";

function Favorites() {
  const { userData } = useContext(UserContext);
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();

  const favorites =
    userData.user.favorites.length === 0
      ? undefined
      : userData.user.favorites.join(",");

  useEffect(() => {
    const getFavorites = () => {
      if (isDefined(favorites)) {
        Axios.get(`/api/listings/listings-by-id?id=${favorites}&type=array`)
          .then((res) => {
            setListings(res.data);
            setLoading(false);
          })
          .catch(() => {
            setMessage("Įvyko klaida. Pabandykite dar kartą");
          });
      } else {
        setLoading(false);
      }
    };

    getFavorites();
  }, [favorites]);

  if (loading) {
    return <LoadingSpinner className="centered-on-page-spinner" />;
  }

  return (
    <Container>
      <h2 className="text-center pt-4">Įsiminti skelbimai</h2>
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
        {isNullable(favorites) ? (
          <Col className="text-center">
            <h4>Skelbimų nėra</h4>
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
}

export default Favorites;
