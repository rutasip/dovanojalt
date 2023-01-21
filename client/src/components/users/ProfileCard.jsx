import React from "react";
import moment from "moment";
import "moment/locale/lt";
import { Link } from "react-router-dom";
import { Row, Col, Container, Image, Button } from "react-bootstrap";

const ProfileCard = ({ writer, hideEditButton }) => {
  moment.locale("lt");
  
  return (
    <Container>
      <Row className="mt-4">
        <Col lg={10} className="d-flex align-items-center">
          <Image
            src={`/${writer.image.filePath}`}
            roundedCircle
            width="70"
            height="70"
            className="mr-2"
            style={{ float: "left" }}
          />
          <span>
            <strong>{writer.username}</strong>
            <br />
            Paskyra registruota {moment(writer.createdAt).fromNow()}
          </span>
          {hideEditButton ? null : (
            <Link to="/users/settings" className="ml-auto">
              <Button variant="dark">Redaguoti paskyrą</Button>
            </Link>
          )}
        </Col>
        <hr className="mb-0" style={{ width: "100%" }} />
      </Row>
    </Container>
  );
};

export default ProfileCard;
