import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import FavoritesToggle from "./FavoritesToggle";
import cities from "../../data/cities";

const Listing = ({
  title,
  date,
  desc,
  location,
  image,
  id,
  writer,
  avatar,
}) => {
  moment.locale("lt");

  const src =
    image.length === 0
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
      : `/${image[0].filePath}`;

  const locationLabel = cities.find((city) => city.value === location);

  return (
    <div className="shadow-sm rounded bg-white p-2 feed-item d-flex flex-column justify-content-between">
      <Link to={`/detail/${id}`} className="text-decoration-none">
        <div className="listing-cover-photo">
          <Image
            src={src}
            className="listing-img rounded shadow-sm"
            alt={title}
          />
          <div
            className="bg-white shadow-sm"
            style={{
              position: "absolute",
              right: 0,
              borderBottomLeftRadius: "var(--bs-border-radius)",
              borderTopRightRadius: "var(--bs-border-radius)",
            }}
            onClick={(evt) => evt.stopPropagation()}
          >
            <FavoritesToggle id={id} size="26px" />
          </div>
        </div>
        <p
          className="title text-dark mt-3 mb-2"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          {title}
        </p>
        <p
          className="description text-secondary mb-3"
          style={{ lineHeight: "1.625" }}
        >
          {desc ? desc : "Nėra aprašymo"}
        </p>
      </Link>
      <div className="d-flex justify-content-between border-top pt-2">
        <p
          className="mb-0 text-secondary align-self-end"
          style={{ fontSize: "12.4px" }}
        >
          įkelta {moment(date).fromNow()}
        </p>
        <span class="badge text-bg-secondary shadow-sm">
          {locationLabel.label}
        </span>
      </div>
    </div>
  );
};

export default Listing;
