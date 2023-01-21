import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Default() {
  return (
    <div className="centered-form">
      <h3 className="mb-4">Puslapis nerastas</h3>
      <Link to="/">
        <Button variant="dark">Sugrįžti į pradinį puslapį</Button>
      </Link>
    </div>
  );
}

export default Default;
