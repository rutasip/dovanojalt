import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import Axios from "axios";
import ErrorMsg from "./ErrorMsg";
import UserContext from "../../context/UserContext";
import facebookImg from "../../assets/icons8-facebook.svg";
import googleImg from "../../assets/icons8-google.svg";

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

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
      history.push("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Modal centered className="d-flex" {...props}>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Prisijungti</Modal.Title>
      </Modal.Header>
      <Modal.Body className="align-self-center" style={{ width: "420px" }}>
        <div className="text-center">
          {/* <h5 className="mb-4">Prisijungti</h5> */}
          <div className="d-inline-flex mt-3 mb-4">
            <div className="rounded shadow-md py-2 px-4 me-2">
              <img src={facebookImg} alt="logo" width="24"></img>
              <span
                className="text-secondary ps-1"
                style={{ fontSize: "12px", fontWeight: "600" }}
              >
                Facebook
              </span>
            </div>
            <div className="rounded shadow-md py-2 px-4">
              <img src={googleImg} alt="logo" width="24"></img>
              <span
                className="text-secondary ps-1"
                style={{ fontSize: "12px", fontWeight: "600" }}
              >
                Google
              </span>
            </div>
          </div>
          <p className="text-secondary mb-4" style={{ fontSize: "14px" }}>
            Arba prisijunk su el. paštu
          </p>
        </div>
        <Form onSubmit={submit}>
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
          <p
            className="text-border text-secondary text-center"
            style={{ fontSize: "14px", marginTop: "10px" }}
          >
            arba
          </p>
          <Button
            variant="dark"
            className="btn font-weight-bolder shadow-sm"
            type="submit"
            onClick={submit}
            block
            style={{ width: "100%" }}
          >
            Registruotis
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
