import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import Axios from "axios";
import cuid from "cuid";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import ListingImageUpload from "../sell/ListingImageUpload";
import ImageList from "../sell/ImageList";
import { isNullable, isDefined } from "../../utils/null-checks";
import LocationSelector from "../shared/LocationSelector";
import CategorySelector from "../shared/CategorySelector";
import LoadingSpinner from "../shared/LoadingSpinner";
import UserContext from "../../context/UserContext";
import AlertMsg from "../shared/AlertMsg";

function EditListing(props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const { setGlobalMsg } = useContext(UserContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [category, setCategory] = useState();
  const [desc, setDesc] = useState();
  const [condition, setCondition] = useState();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState();

  const MAXFILES = 6;
  const imageCount = useRef(0);

  useEffect(() => {
    const getListing = () => {
      Axios.get(`/api/listings/listings-by-id?id=${id}&type=single`)
        .then((res) => {
          setTitle(res.data[0].title);
          setLocation(res.data[0].location);
          setCategory(res.data[0].category);
          setDesc(res.data[0].desc);
          setCondition(res.data[0].condition);

          const preparedImgs = res.data[0].image.map((img) => ({
            ...img,
            id: cuid(),
            src: `/${img.filePath}`,
          }));

          setImages(preparedImgs);
          setFiles(res.data[0].image);

          imageCount.current = res.data[0].image.length;

          setLoading(false);
        })
        .catch((error) => {
          console.error(new Error(error));
        });
    };

    getListing();
  }, [id]);

  const resetForm = () => {
    setGlobalMsg({
      message: "Skelbimas atnaujintas!",
      variant: "dark",
    });
    navigate("/");
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
      isNullable(condition) ||
      condition === "Pasirinkti..."
    ) {
      setMessage("Užpildykite reikiamus laukelius");
      return;
    }

    if (files.length > 6) {
      setMessage(`Įkelkite ne daugiau nei ${MAXFILES} nuotraukas`);
      return;
    }

    let imagesChanged = false;

    files.forEach((file) => {
      if (isNullable(file.filePath)) {
        imagesChanged = true;
      }
    });

    if (!imagesChanged) {
      const updatedListing = {
        title,
        location,
        category,
        files,
        desc,
        condition,
      };

      Axios.post(`/api/listings/update/${id}`, updatedListing, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
        .then(() => {
          resetForm();
        })
        .catch((error) => {
          console.error(new Error(error));
          setMessage("Serverio klaida: nepavyko įkelti");
        });
    } else {
      const updatedListing = {
        title,
        location,
        category,
        files: undefined,
        desc,
        condition,
      };

      Axios.post(`/api/listings/update/${id}`, updatedListing, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
        .then(() => {
          const formData = new FormData();

          files.forEach((file) => {
            if (isNullable(file.filePath)) {
              formData.append("images", file);
            }
          });

          const order = [];
          const filenames = [];
          files.forEach((file) => {
            if (isDefined(file.filePath)) {
              order.push(0);
              filenames.push(file.fileName);
            } else {
              order.push(1);
            }
          });

          return Axios.post(
            `/api/listings/update-images/?id=${id}&order=${order.join(
              ","
            )}&filenames=${filenames.join(",")}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        })
        .then(() => {
          resetForm();
        })
        .catch((error) => {
          console.error(new Error(error));
          setMessage("Serverio klaida: nepavyko įkelti");
        });
    }
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

  return loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : (
    <Container className="pb-4 content">
      <h2 className="py-4 text-center">Redaguoti skelbimą</h2>
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
              placeholder="the more detail the better!"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="formZipcode">
            <Form.Label>Vieta (privaloma)</Form.Label>
            <LocationSelector
              defaultValue={location}
              onChange={(e) => {
                setLocation(e.value);
              }}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formCategory">
            <Form.Label>Kategorija (privaloma)</Form.Label>
            <CategorySelector
              isMulti={false}
              defaultValue={category}
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
            defaultValue={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formCondition">
          <Form.Label>Būklė (privaloma)</Form.Label>
          <Form.Control
            as="select"
            defaultValue={condition}
            onChange={(e) => {
              setCondition(e.target.value);
            }}
          >
            <option>Pasirinkti</option>
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
        <Button
          style={{ float: "right" }}
          variant="dark"
          type="submit"
          onSubmit={onSubmit}
        >
          Keisti
        </Button>
      </Form>
    </Container>
  );
}

export default EditListing;
