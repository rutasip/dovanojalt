import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import moment from "moment";
import "moment/locale/lt";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { socket } from "../../services/socket";
import ListingImageCarousel from "./ListingImageCarousel";
import ListingUserInfo from "./ListingUserInfo";
import LoadingSpinner from "../shared/LoadingSpinner";
import FavoritesToggle from "./FavoritesToggle";
import ListingBreadcrumb from "./ListingBreadcrumb";
import UserContext from "../../context/UserContext";
import DeleteModal from "../shared/DeleteModal";
import Default from "../Default";
import MessageModal from "./MessageModal";
import { isDefined, isNullable } from "../../utils/null-checks";

const ListingDetail = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const { userData, setGlobalMsg } = useContext(UserContext);

  const history = useHistory();

  moment.locale("lt");

  const [noRoute, setNoRoute] = useState(false);

  const [userIsWriter, setUserIsWriter] = useState(false);
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);

  const [chatMessage, setChatMessage] = useState();

  useEffect(() => {
    const getListingDetail = () => {
      Axios.get(`/api/listings/listings-by-id?id=${id}&type=single`)
        .then((res) => {
          if (
            isDefined(userData.user) &&
            res.data[0].writer._id === userData.user.id
          ) {
            setUserIsWriter(true);
          }
          setListing(res.data[0]);
          setLoading(false);
        })
        .catch((error) => {
          setNoRoute(true);
          console.error(new Error(error));
        });
    };

    getListingDetail();
  }, [id, userData.user]);

  const deleteListing = () => {
    Axios.delete(`/api/listings/${id}`)
      .then(() => {
        history.push("/");
        setGlobalMsg({
          message: "Skelbimas ištrintas!",
          variant: "dark",
        });
      })
      .catch((error) => {
        console.error(new Error(error));
      });
  };

  const onSendMessage = () => {
    if (isNullable(userData.user)) {
      setMessageModalShow(false);
      setGlobalMsg({
        message: "Privalote prisijungti norėdami siųsti žinutę",
        variant: "danger",
      });
      return;
    }

    if (isNullable(chatMessage)) {
      setMessageModalShow(false);
      setGlobalMsg({
        message: "Privalote prisijungti norėdami siųsti žinutę",
        variant: "danger",
      });
      return;
    }

    const receiverId = listing.writer._id;
    const senderId = userData.user.id;
    const listingId = listing._id;
    const date = new Date();

    socket.emit(
      "Chat Sent",
      {
        chatMessage,
        senderId,
        receiverId,
        listingId,
        date,
      },
      (error) => {
        if (error) console.error(new Error(error));
      }
    );

    setMessageModalShow(false);
    setGlobalMsg({
      message: "Žinutė išsiųsta!",
      variant: "dark",
    });
  };

  if (noRoute) return <Default />;

  return loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : (
    <Container className="pt-4">
      <ListingBreadcrumb listing={listing} />
      <Row>
        <Col md={7} xs={12} className="pt-2">
          {listing.image.length === 0 ? null : (
            <ListingImageCarousel imgs={listing.image} />
          )}
        </Col>
        <Col md={5} xs={12} className="py-2">
          <div className="d-flex justify-content-between mb-4">
            <div>
              <h3>{listing.title}</h3>
              <span className="font-weight-bold">Būklė: </span>
              {listing.condition}
            </div>
            <div className="d-flex flex-column">
              <FavoritesToggle id={listing._id} size="1.4em" />
            </div>
          </div>

          {userIsWriter ? (
            <>
              <Button
                as={Link}
                to={`/detail/${id}/edit`}
                variant="dark"
                size="lg"
                block
              >
                Redaguoti
              </Button>

              <Button
                variant="outline-dark"
                size="lg"
                block
                onClick={() => setModalShow(true)}
              >
                Ištrinti
              </Button>

              <DeleteModal
                name="skelbimą"
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteFunc={deleteListing}
              />
            </>
          ) : (
            <>
              <Button
                variant="outline-dark"
                size="lg"
                block
                onClick={() => setMessageModalShow(true)}
              >
                Rašyti žinutę
              </Button>

              <MessageModal
                show={messageModalShow}
                onHide={() => setMessageModalShow(false)}
                setChatMessage={setChatMessage}
                onSendMessage={onSendMessage}
              />
            </>
          )}

          <p className="font-weight-bold mt-4 mb-2">Aprašymas</p>
          <p>{listing.desc}</p>
          <hr />
          <ListingUserInfo writer={listing.writer} />
          <hr />
          <p className="text-muted">
            Skelbimas įkeltas {moment(listing.date).fromNow()}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ListingDetail;
