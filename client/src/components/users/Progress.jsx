import React from "react";
import { ProgressBar } from "react-bootstrap";

function Progress({ percentage }) {
  return <ProgressBar animated now={percentage} />;
}

export default Progress;
