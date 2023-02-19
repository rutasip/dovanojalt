/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function MessageModal(props) {
  const { onSendMessage, setChatMessage, disabled, onHide, ...rest } = props;

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Rašyti žinutę
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows="3"
            onChange={(e) => setChatMessage(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          disabled={disabled}
          onClick={onSendMessage}
        >
          Siųsti
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Uždaryti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
