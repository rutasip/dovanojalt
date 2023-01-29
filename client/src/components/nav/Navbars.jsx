import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Navbar, Nav } from "react-bootstrap";
import { isNullable } from "../../utils/null-checks";
import UserContext from "../../context/UserContext";
import Avatar from "./Avatar";
import logoImg from "../../assets/logoipsum-280.svg";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import Login from "../auth/Login";

const Navbars = () => {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");

  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/");
  };

  const onLocationChange = (e) => {
    if (isNullable(e)) {
      setLocation("");
      return;
    }

    setLocation(e.value);
  };

  const onCategoryChange = (e) => {
    if (isNullable(e)) {
      setCategory("");
      return;
    }

    setCategory(e.value);
  };

  const onTextChange = (e) => {
    if (isNullable(e)) {
      setText("");
      return;
    }

    setText(e);
  };

  return (
    <>
      <Login show={showModal} onHide={() => setShowModal(false)} />
      <header id="top-navbar" className="border-bottom bg-white">
        <Navbar
          className="justify-content-between mx-auto"
          style={{ maxWidth: "1280px", paddingRight: "0.75rem" }}
        >
          <Nav.Link as={Link} to="/" className="logo-img-text">
            <img src={logoImg} alt="logo" height="16"></img>
          </Nav.Link>

          <div className="search-bar shadow-sm d-flex">
            <LocationSelector
              isClearable
              onChange={onLocationChange}
              className="location-selector"
            />
            <CategorySelector
              isClearable
              onChange={onCategoryChange}
              className="category-selector"
            />
            <Form.Control
              onChange={(e) => {
                onTextChange(e.target.value);
              }}
              className="border-0"
            />
            <Link
              to={`/${location}/${category}/${text}`}
              variant="light"
              className="d-flex justify-content-center align-items-center border-0 rounded-circle"
              style={{
                width: "73px",
                margin: "3px 6px 2px 6px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#727272"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </Link>
          </div>

          <Nav className="d-flex align-items-center">
            {userData.user ? (
              <>
                <Avatar logout={logout} />
                <Nav.Link as={Link} to="/sell" className="ps-3">
                  <Button
                    className="btn font-weight-bolder shadow-sm"
                    variant="primary"
                  >
                    Įkelti skelbimą
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link>
                  <Button
                    className="btn font-weight-bolder shadow-sm"
                    variant="primary"
                    onClick={() => setShowModal(true)}
                  >
                    Įkelti skelbimą
                  </Button>
                </Nav.Link>
                <Nav.Link>
                  <Button
                    className="btn font-weight-bolder shadow-sm"
                    variant="outline-light"
                    onClick={() => setShowModal(true)}
                  >
                    Registruotis | Prisijungti
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar>
      </header>
    </>
  );
};

export default Navbars;
