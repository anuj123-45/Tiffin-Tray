import React from "react";
import { Link, useNavigate } from "react-router-dom";

import config from "../config.json";
import "../styles/navBar.css";

function NavBar(props) {
  const { isLoggedIn, isCustomer } = props.auth;
  let navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem(config.localStorageKey);
    props.updateToken(null, true);
    isCustomer ? navigate("/customer/login") : navigate("/tiffin-vendor/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark">
      <div className="container-fluid ">
        <Link
          to={isLoggedIn && !isCustomer ? "/tiffin-vendor" : "/customer"}
          className="navbar-brand fs-4 mx-4 fw-bold"
        >
          Tiffin Wale
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {!isLoggedIn && (
            <ul className="navbar-nav ml-auto justify-content">
              <button
                className="nav-link btn mx-2"
                onClick={() => navigate("/customer/login")}
              >
                Login
              </button>
              <button
                className="nav-link btn mx-2"
                onClick={() => navigate("/customer/register")}
              >
                Register
              </button>
            </ul>
          )}
          {isLoggedIn && isCustomer ? (
            <ul className="navbar-nav ml-auto justify-content">
              <button
                className="nav-link btn"
                onClick={() => navigate("/customer/subscriptions")}
              >
                Subscriptions
              </button>
              <button
                className="nav-link btn"
                onClick={() => navigate("/customer/edit")}
              >
                Edit Details
              </button>
              <button className="nav-link btn" onClick={logOut}>
                Logout
              </button>
            </ul>
          ) : (
            <div></div>
          )}
          {isLoggedIn && !isCustomer ? (
            <ul className="navbar-nav ml-auto justify-content">
              <button
                className="nav-link btn"
                onClick={() => navigate("/tiffin-vendor/subscriptions")}
              >
                Subscriptions
              </button>
              <button
                className="nav-link btn"
                onClick={() => navigate("/tiffin-vendor/edit")}
              >
                Edit Details
              </button>
              <button className="nav-link btn" onClick={logOut}>
                Logout
              </button>
            </ul>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
