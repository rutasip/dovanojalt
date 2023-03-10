import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { css } from "glamor";
import ScrollToBottom from "react-scroll-to-bottom";
import { Accordion, Card, Button, Image } from "react-bootstrap";
import ConversationItem from "./ConversationItem";
import ChatInput from "./ChatInput";

const SCROLL_TO_BOTTOM_CSS = css({
  height: 300,
});

function ConversationBox({ listing, conversations, user, socket }) {
  const getChatPartner = () => {
    const sample = conversations[0];
    if (user.id === sample.writer._id) {
      return sample.receiver;
    }
    return sample.writer;
  };

  const [chatMessage, setChatMessage] = useState("");
  const [listingTitle, setListingTitle] = useState();
  const [listingImagePath, setListingImagePath] = useState();
  const [chatPartner] = useState(getChatPartner);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListing = () => {
      Axios.get(`/api/listings/listings-by-id?id=${listing}&type=single`).then(
        (res) => {
          setListingTitle(res.data[0].title);
          setListingImagePath(res.data[0].image[0]?.filePath);

          setLoading(false);
        }
      );
    };

    getListing();
  }, [listing]);

  const onChatSubmit = () => {
    const senderId = user.id;
    const receiverId = chatPartner._id;
    const date = new Date();

    socket.emit(
      "Chat Sent",
      {
        chatMessage,
        senderId,
        receiverId,
        listingId: listing,
        date,
      },
      (error) => {
        if (error) console.error(new Error(error));
      }
    );

    setChatMessage("");
  };

  return loading ? null : (
    <Card>
      <Card.Header className="message-box">
        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey={listing}
          className="w-100"
        >
          <div className="float-left">
            <Image
              src={`/${listingImagePath}`}
              roundedCircle
              width="64"
              height="64"
              className="mr-4"
            />

            <span className="conversation-title font-weight-bold">
              {listingTitle}
            </span>
            <span className="ml-4 conversation-last-msg">
              {conversations[conversations.length - 1].message.length > 40
                ? `${conversations[conversations.length - 1].message.substring(
                    0,
                    40
                  )}...`
                : conversations[conversations.length - 1].message}
            </span>
          </div>

          <div className="float-right message-user">
            <span className="conversation-date text-muted">
              {moment(conversations[0].date).fromNow()}
            </span>
            <br />
            <Link to={`/${chatPartner.username}`}>
              <span className="conversation-partner font-weight-bold">
                {chatPartner.username}
              </span>
            </Link>
          </div>
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={listing}>
        <Card.Body>
          <ScrollToBottom className={`${SCROLL_TO_BOTTOM_CSS}`}>
            <ul className="list-unstyled">
              {conversations.map((convo) => (
                <ConversationItem key={convo._id} conversation={convo} />
              ))}
            </ul>
          </ScrollToBottom>
          <ChatInput
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            onChatSubmit={onChatSubmit}
          />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default ConversationBox;
