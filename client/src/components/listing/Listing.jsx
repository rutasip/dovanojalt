import React from "react";
import { Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoritesToggle from "./FavoritesToggle";

const Listing = ({ title, date, image, id }) => {
  const src =
    image.length === 0
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
      : `/${image[0].filePath}`;

  return (
    <Col lg={3} md={4} sm={6} xs={12} className="my-3 feed-item">
      <div className="border rounded">
        <Link
          to={`/detail/${id}`}
          className="listing-link text-decoration-none"
        >
          <div className="listing-cover-photo">
            <Image src={src} className="listing-img rounded-top" alt={title} />
          </div>
        </Link>
        <div className="d-flex justify-content-between py-2 px-3">
          <p style={{ fontSize: "18px", marginBottom: "0" }}>{title}</p>
          <FavoritesToggle id={id} size="1em" />
        </div>
      </div>
    </Col>
  );
};

export default Listing;
