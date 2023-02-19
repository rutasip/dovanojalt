/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteModal(props) {
  const { deleteFunc, name, onHide, ...rest } = props;

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{border: "none"}} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Ar tikrai norite ištrinti {name}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer style={{border: "none"}}>
        <Button variant="danger" onClick={deleteFunc}>
          Ištrinti
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Uždaryti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
