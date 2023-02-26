import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
// import FavoritesToggle from "./FavoritesToggle";
import cities from "../../data/cities";

function Listing({ title, desc, date, location, image, id }) {
  moment.locale("lt");

  const src =
    image.length === 0
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
      : `/${image[0].filePath}`;

  const locationLabel = cities.find((city) => city.value === location);

  return (
    <div className="d-flex flex-column justify-content-between bg-white rounded shadow-sm p-2 feed-item">
      <Link to={`/detail/${id}`} className="d-flex text-decoration-none">
        <Row>
          <Col xs={3} className="listing-cover-photo">
            <Image
              src={src}
              className="rounded shadow-sm listing-img"
              alt={title}
            />
            <div
              role="presentation"
              className="shadow-sm"
              style={{
                position: "absolute",
                right: 0,
                borderBottomLeftRadius: "var(--bs-border-radius)",
                borderTopRightRadius: "var(--bs-border-radius)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
              onClick={(evt) => evt.stopPropagation()}
              onKeyDown={(evt) => evt.stopPropagation()}
            >
              {/* <FavoritesToggle id={id} size="20px" /> */}
            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-between">
            <div>
              <p className="title">{title}</p>
              <p className="description">{desc  || "aprašymas"}</p>
            </div>
            <small className="text-secondary mb-0">
              {moment(date).fromNow()} · {locationLabel.label}
            </small>
          </Col>
        </Row>
      </Link>
    </div>
  );
}

export default Listing;
