import React, { useState, useContext } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import bsCustomFileInput from "bs-custom-file-input";
import UserContext from "../../context/UserContext";
import Progress from "./Progress";
import LocationSelector from "../shared/LocationSelector";
import DeleteModal from "../shared/DeleteModal";
import AlertMsg from "../shared/AlertMsg";
import { isDefined, isNullable } from "../../utils/null-checks";

const UserSettings = () => {
  bsCustomFileInput.init();
  const { userData, setUserData, setGlobalMsg } = useContext(UserContext);
  const history = useHistory();

  const [file, setFile] = useState();
  const [message, setMessage] = useState({
    message: undefined,
    variant: undefined,
  });
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [username, setUsername] = useState(userData.user.username);
  const [email, setEmail] = useState(userData.user.email);
  const [location, setLocation] = useState(userData.user.location);
  const [password, setPassword] = useState(userData.user.password);

  const [modalShow, setModalShow] = useState(false);

  const onChangeInfoSubmit = (e) => {
    e.preventDefault();

    if (
      isNullable(username) ||
      isNullable(email) ||
      username.length === 0 ||
      email.length === 0
    ) {
      setMessage({ message: "Užpildykite visus laukelius", variant: "danger" });
      return;
    }

    if (
      username === userData.user.username &&
      email === userData.user.email &&
      location === userData.user.location &&
      password === userData.user.password
    ) {
      setMessage({
        message: "Nerasta pakeitimų. Ar tikrai įvedėte naują informaciją?",
        variant: "danger",
      });
      return;
    }

    const newInfo = {
      username,
      email,
      location,
      password,
    };

    Axios.post("/api/users/change-info", newInfo, {
      headers: {
        "x-auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then(() => {
        setMessage({ message: "Informacija atnaujinta!", variant: "dark" });
      })
      .catch((err) => {
        if (isDefined(err.response.data.message)) {
          setMessage({ message: err.response.data.message, variant: "danger" });
        } else {
          setMessage({
            message: "Serverio klaida: pabandykite dar kartą",
            variant: "danger",
          });
        }
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isNullable(file)) {
      setMessage({ message: "Failai neįkelti.", variant: "danger" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    Axios.post("/api/users/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": localStorage.getItem("auth-token"),
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
            10
          )
        );

        setTimeout(() => setUploadPercentage(0), 10000);
      },
    })
      .then(() => {
        setMessage({
          message:
            "Nuotrauka atnaujinta! Perkraukite puslapį norėdami pamatyti pakeitimus.",
          variant: "dark",
        });
      })
      .catch((error) => {
        setMessage({
          message: "Įvyko klaida. Pabandykite dar kartą",
          variant: "dark",
        });
        console.error(new Error(error));
      });
  };

  const deleteAccount = () => {
    Axios.delete("/api/users/delete", {
      headers: { "x-auth-token": localStorage.getItem("auth-token") },
    })
      .then(() => {
        setUserData({
          token: undefined,
          user: undefined,
        });
        localStorage.setItem("auth-token", "");
        history.push("/");
        setGlobalMsg({ message: "Paskyra ištrinta", variant: "dark" });
      })
      .catch((error) => {
        console.error(new Error(error));
      });
  };

  return (
    <Container className="py-4">
      <h2 className="pb-4 text-center">Redaguoti informaciją</h2>
      {message.message ? (
        <AlertMsg
          message={message.message}
          variant={message.variant}
          clearError={() => {
            setMessage({ message: undefined, variant: undefined });
          }}
        />
      ) : null}
      <Form onSubmit={onChangeInfoSubmit}>
        <Form.Row>
          <Form.Group
            as={Col}
            xs="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            controlId="changeUsername"
          >
            <Form.Label>Slapyvardis</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group
            as={Col}
            xs="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            controlId="changeEmail"
          >
            <Form.Label>El. paštas</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group
            as={Col}
            xs="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            controlId="changeLocation"
          >
            <Form.Label>Miestas</Form.Label>
            <LocationSelector
              isClearable={false}
              onChange={(e) => {
                setLocation(e.value);
              }}
              defaultValue={location}
              className="z-index-fix"
            />
          </Form.Group>
          <Form.Group
            as={Col}
            xs="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            controlId="changePassword"
          >
            <Form.Label>Slaptažodis</Form.Label>
            <Form.Control
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
        </Form.Row>
        <Button variant="dark" type="submit" onClick={onChangeInfoSubmit}>
          Keisti
        </Button>{" "}
      </Form>
      <br />
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Paskyros nuotrauka</Form.Label>
          <Form.File
            id="uploadProfilePicture"
            label="Tinka tik .png ir .jpeg formatai"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            custom
          />
        </Form.Group>
        <Progress percentage={uploadPercentage} />
        <br />
        <Button variant="dark" type="submit">
          Įkelti
        </Button>
      </Form>
      <br />
      <Button
        variant="danger"
        className="float-right"
        onClick={() => setModalShow(true)}
      >
        Ištrinti paskyrą
      </Button>

      <DeleteModal
        name="paskyrą"
        show={modalShow}
        onHide={() => setModalShow(false)}
        deleteFunc={deleteAccount}
      />
    </Container>
  );
};

export default UserSettings;
