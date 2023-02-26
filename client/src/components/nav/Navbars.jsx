import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Navbar, Nav, Modal } from "react-bootstrap";
import Axios from "axios";
import ErrorMsg from "../auth/ErrorMsg";
import { isNullable } from "../../utils/null-checks";
import UserContext from "../../context/UserContext";
import Avatar from "./Avatar";
import logoImg from "../../assets/logoipsum-280.svg";
import facebookImg from "../../assets/icons8-facebook.svg";
import googleImg from "../../assets/icons8-google.svg";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";

function Navbars() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  // const [location, setLocation] = useState("");
  // const [category, setCategory] = useState("");
  // const [text, setText] = useState("");
  const [setLocation] = useState("");
  const [setCategory] = useState("");
  const [setText] = useState("");

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [isLogin, setIsLogin] = useState(true);

  const [signupEmail, setSignupEmail] = useState();
  const [signupUsername, setSignupUsername] = useState();
  const [signupPassword, setSignupPassword] = useState();
  const [signupPasswordCheck, setSignupPasswordCheck] = useState();
  const [signupLocation, setSignupLocation] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    navigate("/");
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

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };

      const loginRes = await Axios.post("/api/users/prisijungti", loginUser);
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      // document
      //   .getElementsByClassName("modal-backdrop")[0]
      //   .classList.remove("show");
      // document.getElementsByClassName("modal")[0].classList.add("d-none");
      setShow(false);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const signupSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      passwordCheck: signupPasswordCheck,
      location: signupLocation,
    };

    Axios.post("/api/users/register", newUser)
      .then(() => {
        Axios.post("/api/users/prisijungti", {
          email: signupEmail,
          password: signupPassword,
        });
      })
      .then((res) => {
        setUserData({ token: res.data.token, user: res.data.user });
        localStorage.setItem("auth-token", res.data.token);
        document
          .getElementsByClassName("modal-backdrop")[0]
          .classList.remove("show");
        document.getElementsByClassName("modal")[0].classList.remove("show");
        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <Modal centered className="d-flex" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {isLogin ? (
            <Modal.Title className="h5">Prisijungti</Modal.Title>
          ) : (
            <Modal.Title className="h5">Registruotis</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body className="align-self-center" style={{ width: "440px" }}>
          <div className="d-flex justify-content-center mt-3 mb-4">
            <div className="rounded shadow-md mx-2 py-2 px-3">
              <img src={facebookImg} alt="logo" width="32" />
            </div>
            <div className="rounded shadow-md mx-2 py-2 px-3">
              <img src={googleImg} alt="logo" width="32" />
            </div>
          </div>
          {isLogin ? (
            <>
              <Form onSubmit={submit}>
                <p
                  className="text-border text-secondary text-center mb-4"
                  style={{ fontSize: "14px" }}
                >
                  arba
                </p>
                {error && (
                  <ErrorMsg
                    message={error}
                    clearError={() => {
                      setError(undefined);
                    }}
                  />
                )}
                <Form.Control
                  type="email"
                  placeholder="El. paštas"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoFocus
                />
                <Form.Control
                  type="password"
                  placeholder="Slaptažodis"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Button
                  variant="primary"
                  className="btn font-weight-bolder shadow-sm"
                  type="submit"
                  onClick={submit}
                  block
                  style={{ width: "100%" }}
                >
                  Prisijungti
                </Button>
              </Form>
              <p
                className="text-secondary text-center mt-4 mb-2"
                style={{ fontSize: "14px" }}
              >
                dar neturi paskyros?
              </p>
            </>
          ) : (
            <>
              <Form id="signupForm" onSubmit={submit}>
                <p
                  className="text-border text-secondary text-center mb-4"
                  style={{ fontSize: "14px" }}
                >
                  arba
                </p>
                {error && (
                  <ErrorMsg
                    message={error}
                    clearError={() => {
                      setError(undefined);
                    }}
                  />
                )}
                <Form.Control
                  type="text"
                  placeholder="Slapyvardis"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setSignupUsername(e.target.value);
                  }}
                  autoFocus
                />
                <Form.Control
                  type="email"
                  placeholder="El. paštas"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                  }}
                />
                <Form.Control
                  type="password"
                  placeholder="Slaptažodis"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                  }}
                />
                <Form.Control
                  type="password"
                  placeholder="Pakartoti slaptažodį"
                  className="font-size-medium mb-3"
                  size="lg"
                  onChange={(e) => {
                    setSignupPasswordCheck(e.target.value);
                  }}
                />
                <Form.Group className="font-size-medium mb-3">
                  <LocationSelector
                    onChange={(e) => {
                      setSignupLocation(e.value);
                    }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className="btn font-weight-bolder shadow-sm"
                  type="submit"
                  onClick={signupSubmit}
                  style={{ width: "100%" }}
                >
                  Registruotis
                </Button>
              </Form>
              <p
                className="text-secondary text-center mt-4 mb-2"
                style={{ fontSize: "14px" }}
              >
                jau turi paskyrą?
              </p>
            </>
          )}
          <Button
            variant="dark"
            className="btn font-weight-bolder shadow-sm"
            style={{ width: "100%" }}
            onClick={() => (isLogin ? setIsLogin(false) : setIsLogin(true))}
          >
            {isLogin ? "Registruotis" : "Prisijungti"}
          </Button>
        </Modal.Body>
      </Modal>
      <header id="top-navbar" className="border-bottom bg-white">
        <Navbar
          className="justify-content-between px-3 mx-auto"
          style={{ maxWidth: "1260px" }}
        >
          <Nav.Link as={Link} to="/" className="logo-img-text">
            <img src={logoImg} alt="logo" height="16" />
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
              // to={`/${location}/${category}/${text}`}
              to="/"
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
                <Nav.Link as={Link} to="/messages">
                  <Button
                    className="btn border-none rounded-circle p-0 mx-1"
                    variant="outline-light"
                    style={{ width: "35px", height: "35px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#727272"
                      className="bi bi-chat"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                    </svg>
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/users/favorites">
                  <Button
                    className="btn border-none rounded-circle p-0 mx-1"
                    style={{
                      marginRight: "12px",
                      width: "35px",
                      height: "35px",
                    }}
                    variant="outline-light"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#727272"
                      className="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                    </svg>
                  </Button>
                </Nav.Link>
                <div className="pe-3 ps-2">
                  <Avatar logout={logout} />
                </div>
                <Nav.Link as={Link} to="/sell">
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
                    className="btn font-weight-bolder shadow-sm me-3"
                    variant="primary"
                    onClick={handleShow}
                  >
                    Įkelti skelbimą
                  </Button>
                </Nav.Link>
                <Nav.Link>
                  <Button
                    className="btn font-weight-bolder shadow-sm"
                    variant="outline-light"
                    onClick={handleShow}
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
}

export default Navbars;
