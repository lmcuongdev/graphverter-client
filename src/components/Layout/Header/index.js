import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Header.css";
import logoSvg from "assets/logo.svg";

const homeIsSelected = (path) => {
  if (path === "/" || path.startsWith("/projects")) {
    return true;
  }
  return false;
};

const Header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar bg="light" variant="primary" className="px-2">
      <Navbar.Brand>
        <img
          src={logoSvg}
          width="120"
          height="30"
          className="d-inline-block align-top"
          alt="logo"
          style={{ cursor: "pointer" }}
        />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link
          as={Link}
          to="/"
          className={homeIsSelected(path) ? "selected" : ""}
        >
          Home
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/playground"
          className={["/playground"].includes(path) ? "selected" : ""}
        >
          Configure
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
