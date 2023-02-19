import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingSpinner({ className }) {
  return (
    <Spinner
      animation="border"
      role="status"
      variant="dark"
      className={className}
    >
      <span className="sr-only">Kraunasi...</span>
    </Spinner>
  );
};

export default LoadingSpinner;
