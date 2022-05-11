import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Header.css";
import logoSvg from "assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "app/slices/authSlice";

const homeIsSelected = (path) => {
  if (path === "/" || path.startsWith("/projects")) {
    return true;
  }
  return false;
};

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const path = useLocation().pathname;

  return (
    <Navbar bg="light" variant="primary" className="px-2">
      <div className="container-xxl d-flex align-items-md-center">
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
        {isLoggedIn && (
          <>
            <Nav className="me-auto">
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
            <Nav className="me-5">
              <NavDropdown
                title={<i className="fa-regular fa-circle-user fs-4"></i>}
                align="end"
              >
                <NavDropdown.Item
                  onClick={() => {
                    dispatch(logout());
                  }}
                >
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
