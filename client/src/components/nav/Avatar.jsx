import React, { useContext } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

function Avatar({ logout }) {
  const { userData } = useContext(UserContext);

  return (
    <NavDropdown
      align="end"
      title={
        <Image
          src={userData.loading ? null : `/${userData.user.image.filePath}`}
          width="35"
          height="35"
          roundedCircle
        />
      }
    >
      <NavDropdown.Item as={Link} to="/users/myitems">
        Mano skelbimai
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/users/settings">
        Nustatymai
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item className="text-danger" onClick={logout}>
        Atsijungti
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default Avatar;
