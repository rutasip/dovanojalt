import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import Axios from "axios";
import ErrorMsg from "./ErrorMsg";
import UserContext from "../../context/UserContext";
import facebookImg from "../../assets/icons8-facebook.svg";
import googleImg from "../../assets/icons8-google.svg";
import LocationSelector from "../shared/LocationSelector";

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [isLogin, setIsLogin] = useState(true);

  const [signupEmail, setSignupEmail] = useState();
  const [signupUsername, setSignupUsername] = useState();
  const [signupPassword, setSignupPassword] = useState();
  const [signupPasswordCheck, setSignupPasswordCheck] = useState();
  const [signupLocation, setSignupLocation] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

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
      document
        .getElementsByClassName("modal-backdrop")[0]
        .classList.remove("show");
      document.getElementsByClassName("modal")[0].classList.remove("show");
      history.push("/");
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
        return Axios.post("/api/users/prisijungti", {
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
        history.push("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <Modal centered className="d-flex" block="true" {...props}>
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
              <img src={facebookImg} alt="logo" width="32"></img>
            </div>
            <div className="rounded shadow-md mx-2 py-2 px-3">
              <img src={googleImg} alt="logo" width="32"></img>
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
    </>
  );
};

export default Login;
