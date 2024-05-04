import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/protectedRoute";
import CustomerHome from "./components/customerHome";
import CustomerLogin from "./components/customerLogin";
import CustomerRegister from "./components/customerRegister";
import CustomerEditDetails from "./components/customerEditDetails";
import TiffinVendorHome from "./components/tiffinVendorHome";
import TiffinVendorLogin from "./components/tiffinVendorLogin";
import TiffinVendorRegister from "./components/tiffinVendorRegister";
import TiffinVendorEditDetails from "./components/tiffinVendorEditDetails";
import TiffinVendorDetails from "./components/tiffinVendorDetails";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";

import config from "./config.json";
import "./App.css";
import CustomerSubscriptions from "./components/customerSubscriptions";
import TiffinVendorSubscriptions from "./components/tiffinVendorSubscriptions";

function App() {
  const defaultState = {
    isLoggedIn: false,
    isCustomer: true,
    token: null,
  };

  const getInitialState = () => {
    let localStorageState = localStorage.getItem(config.localStorageKey);
    if (localStorageState) localStorageState = JSON.parse(localStorageState);
    const initialState = localStorageState || defaultState;
    return initialState;
  };

  const [state, setState] = useState({ ...getInitialState() });

  const handleToken = (token, isCustomer) => {
    if (token === null) {
      setState({ ...getInitialState() });
      return;
    }
    const currState = { ...state };
    currState.isLoggedIn = true;
    currState.isCustomer = isCustomer;
    currState.token = token;
    localStorage.setItem(config.localStorageKey, JSON.stringify(currState));
    setState(currState);
  };

  return (
    <React.Fragment>
      <NavBar auth={state} updateToken={handleToken} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route
          path="/customer"
          element={<CustomerHome auth={state} updateToken={handleToken} />}
        />
        <Route
          path="/customer/login"
          element={<CustomerLogin updateToken={handleToken} />}
        />
        <Route
          path="/customer/register"
          element={<CustomerRegister updateToken={handleToken} />}
        />
        <Route
          path="/customer/edit"
          element={
            <ProtectedRoute
              auth={state}
              toNavigate="/customer/login"
              type="customer"
            >
              <CustomerEditDetails auth={state} updateToken={handleToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/subscriptions"
          element={
            <ProtectedRoute
              auth={state}
              toNavigate={"/customer/login"}
              type="customer"
            >
              <CustomerSubscriptions auth={state} />
            </ProtectedRoute>
          }
        />

        <Route
          path={`/customer/vendor/:id`}
          element={<TiffinVendorDetails auth={state} />}
        />

        <Route
          path="/tiffin-vendor"
          element={
            <ProtectedRoute
              auth={state}
              toNavigate="/tiffin-vendor/login"
              type="tiffin-vendor"
            >
              <TiffinVendorHome auth={state} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tiffin-vendor/login"
          element={<TiffinVendorLogin updateToken={handleToken} />}
        />
        <Route
          path="/tiffin-vendor/register"
          element={<TiffinVendorRegister updateToken={handleToken} />}
        />
        <Route
          path="/tiffin-vendor/edit"
          element={
            <ProtectedRoute
              auth={state}
              toNavigate="/tiffin-vendor/login"
              type="tiffin-vendor"
            >
              <TiffinVendorEditDetails auth={state} updateToken={handleToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tiffin-vendor/subscriptions"
          element={
            <ProtectedRoute
              auth={state}
              toNavigate={"/tiffin-vendor/login"}
              type="tiffin-vendor"
            >
              <TiffinVendorSubscriptions auth={state} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
