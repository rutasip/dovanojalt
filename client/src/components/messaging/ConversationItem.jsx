import React from "react";
import moment from "moment";
import { Image } from "react-bootstrap";

const ConversationItem = ({ conversation }) => {
  return (
    <li className="media my-2">
      <Image
        src={`/${conversation.writer.image.filePath}`}
        className="align-self-start mr-3"
        alt="Writer Avatar"
        roundedCircle
        width="32"
        height="32"
      />
      <div className="mr-4 conversation-user" style={{ width: "150px" }}>
        <span className="font-weight-bold">{conversation.writer.username}</span>
        <br />
        <span className="text-muted">
          {moment(conversation.date).fromNow()}
        </span>
      </div>
      <div className="media-body">
        {conversation.message}
      </div>
    </li>
  );
};

export default ConversationItem;
