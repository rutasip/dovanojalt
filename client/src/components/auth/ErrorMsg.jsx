import React from "react";
import { Alert } from "react-bootstrap";

function ErrorMsg({ clearError, message }) {
  return (
    <Alert
      variant="danger"
      onClose={clearError}
      dismissible
    >
      <span style={{ fontSize: "14px" }}>{message}</span>
    </Alert>
  );
};

export default ErrorMsg;
