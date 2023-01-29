import React, { useContext } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Avatar = ({ logout }) => {
  const { userData } = useContext(UserContext);

  return (
    <NavDropdown
      title={
        <Image
          src={userData.loading ? null : `/${userData.user.image.filePath}`}
          width="30"
          height="30"
          roundedCircle
        />
      }
      id="nav-dropdown-align-right"
    >
      <NavDropdown.Item href="/messages">Žinutės</NavDropdown.Item>
      <NavDropdown.Item href="/users/myitems">Mano skelbimai</NavDropdown.Item>
      <NavDropdown.Item href="/users/favorites">
        Įsiminti skelbimai
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/users/settings">
        Nustatymai
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>Atsijungti</NavDropdown.Item>
    </NavDropdown>
  );
};

export default Avatar;
