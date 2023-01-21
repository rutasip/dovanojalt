import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListingUserInfo = ({ writer }) => {
  return (
    <Link
      to={`/user/${writer.username}`}
      className="d-flex align-items-center link-no-style text-decoration-none"
    >
      <Image
        src={`/${writer.image.filePath}`}
        roundedCircle
        width="50"
        height="50"
        className="mr-2"
        style={{ float: "left" }}
      />
      <span>
        <strong>
          {writer.username}
        </strong>
      </span>
      <br />
    </Link>
  );
};

export default ListingUserInfo;
