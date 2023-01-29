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
      document.getElementsByClassName("modal-backdrop")[0].classList.remove("show");
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
        document.getElementsByClassName("modal-backdrop")[0].classList.remove("show");
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
          <div className="text-center">
            <div className="mt-3 mb-4">
              <div className="rounded shadow-md py-2 px-3">
                <img
                  src={facebookImg}
                  style={{ float: "left" }}
                  alt="logo"
                  width="26"
                ></img>
                <span
                  className="text-secondary"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Tęsti naudojant Facebook
                </span>
              </div>
              <div className="rounded shadow-md py-2 px-3 mt-3">
                <img
                  src={googleImg}
                  alt="logo"
                  style={{ float: "left" }}
                  width="26"
                ></img>
                <span
                  className="text-secondary"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Tęsti naudojant Google
                </span>
              </div>
            </div>
          </div>
          {isLogin ? (
            <>
              <Form onSubmit={submit}>
                <p className="text-secondary text-center mb-4" style={{ fontSize: "14px" }}>
                  Arba prisijunk su el. paštu
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
            </>
          ) : (
            <Form id="signupForm" onSubmit={submit}>
              <p className="text-secondary text-center mb-4" style={{ fontSize: "14px" }}>
                Arba registruokis su el. paštu
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
          )}
          <p
            className="text-border text-secondary text-center"
            style={{ fontSize: "14px", marginTop: "10px" }}
          >
            arba
          </p>
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
