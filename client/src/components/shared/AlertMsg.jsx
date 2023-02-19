import React from "react";
import { Alert } from "react-bootstrap";

function AlertMsg({ message, variant, clearError }) {
  return (
    <Alert variant={variant} onClose={clearError} dismissible>
      {message}
    </Alert>
  );
};

export default AlertMsg;
