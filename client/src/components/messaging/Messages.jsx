import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Container, Row, Tab, Nav, Col, Accordion } from "react-bootstrap";
import { socket } from "../../services/socket";
import UserContext from "../../context/UserContext";
import ConversationBox from "./ConversationBox";
import LoadingSpinner from "../shared/LoadingSpinner";

const groupBy = (arr, property) => {
  return arr.reduce((acc, curr) => {
    if (!acc[curr[property]]) {
      acc[curr[property]] = [];
    }
    acc[curr[property]].push(curr);
    return acc;
  }, {});
};

const Messages = () => {
  const { userData } = useContext(UserContext);
  const [buyMessages, setBuyMessages] = useState({});
  const [buyLoading, setBuyLoading] = useState(true);
  const [sellMessages, setSellMessages] = useState({});
  const [sellLoading, setSellLoading] = useState(true);

  const getBuyMessages = () => {
    Axios.get("/api/chats/buy-messages", {
      headers: {
        "x-auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((res) => {
        const chats = res.data;
        const sortedChats = groupBy(chats, "listing");

        setBuyMessages(sortedChats);
        setBuyLoading(false);
      })
      .catch((error) => {
        console.error(new Error(error));
      });
  };

  const getSellMessages = () => {
    Axios.get("/api/chats/sell-messages", {
      headers: {
        "x-auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((res) => {
        const chats = res.data;
        const sortedChats = groupBy(chats, "listing");

        setSellMessages(sortedChats);
        setSellLoading(false);
      })
      .catch((error) => {
        console.error(new Error(error));
      });
  };

  useEffect(() => {
    socket.on("Output Chat Sent", (message) => {
      if (message.listing.writer === userData.user.id) {
        getSellMessages();
      } else {
        getBuyMessages();
      }
    });

    socket.on("Output Offer Sent", (message) => {
      if (message.listing.writer === userData.user.id) {
        getSellMessages();
      } else {
        getBuyMessages();
      }
    });

    getBuyMessages();
    getSellMessages();

    return () => {
      socket.off();
    };
  }, [userData.user.id]);

  return (
    <Container fluid>
      <Row className="my-4">
        <Tab.Container defaultActiveKey="Mane dominantys skelbimai">
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <Nav
              fill
              variant="pills"
              className="justify-content-center message-tabs"
            >
              <Nav.Item>
                <Nav.Link  eventKey="Mane dominantys skelbimai">Mane dominantys skelbimai</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Mano skelbimai">Mano skelbimai</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <Tab.Content>
              <Tab.Pane eventKey="Mane dominantys skelbimai">
                <Accordion className="mt-4">
                  {buyLoading ? (
                    <LoadingSpinner className="centered-on-page-spinner" />
                  ) : Object.keys(buyMessages).length === 0 ? (
                    <h3 className="text-center">Nėra pranešimų</h3>
                  ) : (
                    Object.keys(buyMessages).map((key) => (
                      <ConversationBox
                        key={key}
                        socket={socket}
                        listing={key}
                        user={userData.user}
                        conversations={buyMessages[key]}
                      />
                    ))
                  )}
                </Accordion>
              </Tab.Pane>
              <Tab.Pane eventKey="Mano skelbimai">
                <Accordion className="mt-4">
                  {sellLoading ? (
                    <LoadingSpinner className="centered-on-page-spinner" />
                  ) : Object.keys(sellMessages).length === 0 ? (
                    <h3 className="text-center">Nėra pranešimų</h3>
                  ) : (
                    Object.keys(sellMessages).map((key) => (
                      <ConversationBox
                        key={key}
                        socket={socket}
                        listing={key}
                        user={userData.user}
                        conversations={sellMessages[key]}
                      />
                    ))
                  )}
                </Accordion>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Tab.Container>
      </Row>
    </Container>
  );
};

export default Messages;