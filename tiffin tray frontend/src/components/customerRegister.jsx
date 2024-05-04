import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearToken } from "./services/clearJwt";
import { registerCustomer as register } from "./services/customerService";
import FormInput from "./common/formInput";

import "../styles/auth.css";

function CustomerRegister(props) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    password: "",
    area: "",
    city: "",
    pincode: "",
  });
  let navigate = useNavigate();
  useEffect(() => {
    clearToken(props.updateToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    const cust = { ...customer };
    cust[input.name] = input.value;
    setCustomer(cust);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(customer, props.updateToken);
    if (result === true) navigate("/customer");
    else if (result) toast.error(result.data);
  };
  return (
    <div className="card form-card shadow-lg">
      <div className="card-body">
        <form>
          <h5 className="card-title mb-5">Customer Register</h5>
          <FormInput
            value={customer.name}
            type="text"
            name="name"
            onChange={handleChange}
          />
          <FormInput
            value={customer.email}
            type="email"
            name="email"
            onChange={handleChange}
          />
          <FormInput
            value={customer.password}
            type="password"
            name="password"
            onChange={handleChange}
          />
          <FormInput
            value={customer.area}
            type="text"
            name="area"
            onChange={handleChange}
          />
          <FormInput
            value={customer.city}
            type="text"
            name="city"
            onChange={handleChange}
          />
          <FormInput
            value={customer.pincode}
            type="number"
            name="pincode"
            onChange={handleChange}
          />

          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>
          <h5 className="message">
            Not a Customer?{" "}
            <Link className="pointer" to="/tiffin-vendor/login">
              Tiffin Vendor
            </Link>
          </h5>
          <h5 className="message">
            Already Registered?{" "}
            <Link className="pointer" to="/customer/login">
              Login
            </Link>
          </h5>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
