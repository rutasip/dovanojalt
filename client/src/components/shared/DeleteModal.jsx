import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = (props) => {
  const { deleteFunc, ...rest } = props;

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{border: "none"}} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Ar tikrai norite ištrinti {props.name}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer style={{border: "none"}}>
        <Button variant="danger" onClick={deleteFunc}>
          Ištrinti
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Uždaryti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
