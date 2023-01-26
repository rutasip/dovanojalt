import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorMsg from "./ErrorMsg";
import LocationSelector from "../shared/LocationSelector";

const Signup = (props) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [location, setLocation] = useState();

  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = (e) => {
    e.preventDefault();

    const newUser = { username, email, password, passwordCheck, location };

    Axios.post("/api/users/register", newUser)
      .then(() => {
        return Axios.post("/api/users/prisijungti", {
          email,
          password,
        });
      })
      .then((res) => {
        setUserData({ token: res.data.token, user: res.data.user });
        localStorage.setItem("auth-token", res.data.token);
        history.push("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <Modal centered className="d-flex" {...props}>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Registruotis</Modal.Title>
      </Modal.Header>
      <Modal.Body className="align-self-center" style={{ width: "420px" }}>
        <div className="form-wrapper">
          <Form className="centered-form" onSubmit={submit}>
            {error && (
              <ErrorMsg
                message={error}
                clearError={() => {
                  setError(undefined);
                }}
              />
            )}
            <Form.Group controlId="formUsername">
              <Form.Label>Slapyvardis</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>El. paštas</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Slaptažodis</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formVerifyPassword">
              <Form.Label>Pakartoti slaptažodį</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPasswordCheck(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Miestas</Form.Label>
              <LocationSelector
                onChange={(e) => {
                  setLocation(e.value);
                }}
              />
            </Form.Group>
            <Button variant="dark" type="submit" onClick={submit} block>
              Registruotis
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Signup;
