import React, { useEffect, useState } from "react";
// import { useContext } from "react";
import Axios from "axios";
import { Container } from "react-bootstrap";
import Listing from "./listing/Listing";
import LoadingSpinner from "./shared/LoadingSpinner";
// import UserContext from "../context/UserContext";
// import { isDefined } from "../utils/null-checks";
import AlertMsg from "./shared/AlertMsg";

function Home() {
  // const {
  //   match: {
  //     params: { location, category, text },
  //   },
  // } = props;

  // const { userData } = useContext(UserContext);

  const [listingData, setListingData] = useState({
    listings: [],
    loading: true,
  });

  // const decideLocation = () => {
  //   if (isDefined(userData.user)) {
  //     return userData.user.location;
  //   }

  //   return undefined;
  // };

  // const [location, setLocation] = useState(decideLocation);
  const [message, setMessage] = useState("");

  const getListings = (variables) => {
    Axios.post("/api/listings/", variables)
      .then((res) => {
        // if (variables.fetchMore === true) {
        //   setListingData({
        //     listings: [...listingData.listings, ...res.data],
        //     loading: false,
        //   });
        // } else {
          setListingData({
            listings: res.data,
            loading: false,
          });
        // }
      })
      .catch((error) => {
        setMessage("Nepavyko gauti skelbimų. Pabandykite dar kartą");
        console.error(new Error(error));
      });
  };

  // useEffect(() => {
  //   const variables = {
  //     location,
  //     category,
  //     text,
  //   };

  //   getListings(variables);
  // }, [location, category, text]);

  useEffect(() => {
    getListings();
  }, []);

  return listingData.loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : (
    <Container fluid className="g-0 pb-5 content">
      {message ? (
        <AlertMsg
          message={message}
          variant="danger"
          clearError={() => {
            setMessage(undefined);
          }}
        />
      ) : null}

      <div id="feed" className="px-3">
        {listingData.listings.map((listing) => (
          <Listing
            title={listing.title}
            date={listing.date}
            desc={listing.desc}
            image={listing.image}
            location={listing.location}
            key={listing._id}
            id={listing._id}
            writer={listing.writer.username}
            avatar={listing.writer.image.filePath}
          />
        ))}
      </div>
    </Container>
  );
};

export default Home;
