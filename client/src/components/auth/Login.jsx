import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, FloatingLabel, Button, Modal } from "react-bootstrap";
import Axios from "axios";
import ErrorMsg from "./ErrorMsg";
import UserContext from "../../context/UserContext";

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
    <Modal className="d-flex align-items-center" {...props}>
      <Modal.Body className="align-self-center" style={{ width: "420px" }}>
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
            className="btn font-weight-bolder"
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
            className="btn font-weight-bolder"
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
