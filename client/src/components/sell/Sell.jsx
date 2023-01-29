import React, { useState, useCallback, useContext, useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Axios from "axios";
import cuid from "cuid";
import { useHistory } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import UserContext from "../../context/UserContext";
import ListingImageUpload from "./ListingImageUpload";
import ImageList from "./ImageList";
import { isNullable } from "../../utils/null-checks";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import AlertMsg from "../shared/AlertMsg";

const Sell = () => {
  const { userData, setGlobalMsg } = useContext(UserContext);

  const history = useHistory();

  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [category, setCategory] = useState();
  const [desc, setDesc] = useState();
  const [condition, setCondition] = useState();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const [message, setMessage] = useState();

  const MAXFILES = 6;

  const imageCount = useRef(0);

  const resetForm = () => {
    setGlobalMsg({
      message: "Skelbimas įkeltas!",
      variant: "dark",
    });
    history.push("/");
  };

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = images[dragIndex];
    const draggedFile = files[dragIndex];

    setImages(
      update(images, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedImage],
        ],
      })
    );

    setFiles(
      update(files, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedFile],
        ],
      })
    );
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > MAXFILES) {
      setMessage(
        `Viršijote nuotraukų skaičių. Maksimalus nuotraukų skaičius: ${MAXFILES}`
      );
      return;
    }

    imageCount.current += acceptedFiles.length;

    if (imageCount.current > MAXFILES) {
      setMessage(
        `Viršijote nuotraukų skaičių. Maksimalus nuotraukų skaičius: ${MAXFILES}`
      );
      imageCount.current -= acceptedFiles.length;
      return;
    }

    acceptedFiles.map((file) => {
      setFiles((prevState) => [...prevState, file]);

      const reader = new FileReader();

      reader.onload = (e) => {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      isNullable(title) ||
      isNullable(location) ||
      isNullable(category) ||
      condition === "Pasirinkti..."
    ) {
      setMessage("Užpildykite reikiamus laukelius");
      return;
    }

    if (files.length > 6) {
      setMessage(`Įkelkite ne daugiau nei ${MAXFILES} nuotraukas`);
      return;
    }

    const newListing = {
      writer: userData.user.id,
      title,
      date: new Date(),
      location,
      category,
      desc,
      condition,
    };

    Axios.post("/api/listings/add", newListing, {
      headers: {
        "x-auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((res) => {
        if (files.length === 0) {
          resetForm();
          return undefined;
        }

        const formData = new FormData();

        for (let i = 0; i < files.length; i += 1) {
          formData.append("images", files[i]);
        }

        return Axios.post("/api/listings/add/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "listing-id": res.data.id,
          },
        });
      })
      .then(() => {
        resetForm();
      })
      .catch(() => {
        setMessage("Serverio klaida: nepavyko įkelti");
      });
  };

  const onDelete = (index) => {
    imageCount.current -= 1;

    const newImages = [...images];
    const newFiles = [...files];

    newImages.splice(index, 1);
    newFiles.splice(index, 1);

    setImages(newImages);
    setFiles(newFiles);
  };

  return (
    <Container className="pb-4">
      <h2 className="py-4 text-center">Naujas skelbimas</h2>
      {message ? (
        <AlertMsg
          message={message}
          variant="danger"
          clearError={() => {
            setMessage(undefined);
          }}
        />
      ) : null}
      <Form onSubmit={onSubmit} id="create-listing-form">
        <Row>
          <Form.Group as={Col} controlId="formTitle">
            <Form.Label>Antraštė (privaloma)</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group
            as={Col}
            xs="12"
            sm="12"
            md="12"
            lg="6"
            xl="6"
            controlId="formZipcode"
          >
            <Form.Label>Vieta (privaloma)</Form.Label>
            <LocationSelector
              onChange={(e) => {
                setLocation(e.value);
              }}
            />
          </Form.Group>

          <Form.Group
            as={Col}
            xs="12"
            sm="12"
            md="12"
            lg="6"
            xl="6"
            controlId="formCategory"
          >
            <Form.Label>Kategorija (privaloma)</Form.Label>
            <CategorySelector
              isMulti={false}
              onChange={(e) => {
                setCategory(e.value);
              }}
            />
          </Form.Group>
        </Row>

        <Form.Group controlId="formDescription">
          <Form.Label>Aprašymas</Form.Label>
          <Form.Control
            as="textarea"
            rows="4"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formCondition">
          <Form.Label>Būklė (privaloma)</Form.Label>
          <Form.Control
            as="select"
            defaultValue="Pasirinkti..."
            onChange={(e) => {
              setCondition(e.target.value);
            }}
          >
            <option></option>
            <option>Nauja</option>
            <option>Naudota</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formImages">
          <Form.Label>Nuotraukos</Form.Label>
          <ListingImageUpload onDrop={onDrop} />
          <DndProvider backend={HTML5Backend}>
            <ImageList
              images={images}
              moveImage={moveImage}
              onDelete={onDelete}
            />
          </DndProvider>
        </Form.Group>
        <Button style={{ float: "right" }} variant="dark" type="submit">
          Skelbti
        </Button>
      </Form>
    </Container>
  );
};

export default Sell;
