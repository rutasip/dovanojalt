import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Axios from "axios";
import LoadingSpinner from "../shared/LoadingSpinner";
import ProfileCard from "./ProfileCard";
import Listing from "../listing/Listing";
import Default from "../Default";
import AlertMsg from "../shared/AlertMsg";

function Seller(props) {
  const {
    match: {
      params: { username },
    },
  } = props;

  const [writer, setWriter] = useState();
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [noRoute, setNoRoute] = useState(false);

  useEffect(() => {
    const getSellerListings = () => {
      Axios.get(`/api/users/find-by-username?username=${username}`)
        .then((res) => {
          if (res.data.length === 0) {
            setNoRoute(true);
            return undefined;
          }
          setWriter(res.data[0]);

          return Axios.get(
            `/api/listings/listings-by-user?id=${res.data[0]._id}`
          );
        })
        .then((res) => {
          setListings(res.data);
          setLoading(false);
        })
        .catch(() => {
          setMessage("Nepavyko gauti skelbimų. Pabandykite vėliau.");
          setLoading(false);
        });
    };

    getSellerListings();
  }, [username]);

  if (noRoute) return <Default />;

  return loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : (
    <>
    <ProfileCard writer={writer} hideEditButton />
    <Container>
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
        {listings.map((listing) => (
          <Listing
            title={listing.title}
            date={listing.date}
            desc={listing.desc}
            image={listing.image}
            location={listing.location}
            id={listing._id}
            key={listing._id}
          />
        ))}
      </Row>
    </Container>
    </>
  );
};

export default Seller;
