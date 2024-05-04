import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FormInput from "./common/formInput";
import { registerTiffinVendor as register } from "./services/vendorService";
import { clearToken } from "./services/clearJwt";

import "../styles/auth.css";

function TiffinVendorRegister(props) {
  const [tiffinVendor, setTiffinVendor] = useState({
    "business name": "",
    email: "",
    password: "",
    area: "",
    city: "",
    pincode: "",
    phone: "",
    "monthly rate": "",
    "monthly discounted rate": "",
    "minimum month for discount": "",
    "breakfast items": "",
    "lunch items": "",
    "dinner items": "",
    "veg option?": false,
  });
  let navigate = useNavigate();
  useEffect(() => {
    clearToken(props.updateToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    const vendor = { ...tiffinVendor };
    const { name, value } = input;
    if (name === "veg option?")
      value === "false" ? (vendor[name] = true) : (vendor[name] = false);
    else vendor[name] = value;
    setTiffinVendor(vendor);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(tiffinVendor, props.updateToken);
    if (result === true) navigate("/tiffin-vendor");
    else if (result) toast.error(result.data);
  };

  return (
    <React.Fragment>
      <div
        className="card form-card shadow-lg"
        style={{ margin: "10px auto", width: "450px" }}
      >
        <div className="card-body">
          <form>
            <h5 className="card-title mb-5">Tiffin Vendor Register</h5>
            <FormInput
              value={tiffinVendor["business name"]}
              type="text"
              name="business name"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.email}
              type="email"
              name="email"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.password}
              type="password"
              name="password"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.area}
              type="text"
              name="area"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.city}
              type="text"
              name="city"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.pincode}
              type="number"
              name="pincode"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor.phone}
              type="number"
              name="phone"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["monthly rate"]}
              type="number"
              name="monthly rate"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["monthly discounted rate"]}
              type="number"
              name="monthly discounted rate"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["minimum month for discount"]}
              type="number"
              name="minimum month for discount"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["breakfast items"]}
              type="text"
              name="breakfast items"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["lunch items"]}
              type="text"
              name="lunch items"
              onChange={handleChange}
            />
            <FormInput
              value={tiffinVendor["dinner items"]}
              type="text"
              name="dinner items"
              onChange={handleChange}
            />
            <div className="form-check">
              <label className="form-check-label" htmlFor="veg option?">
                Veg option present?
              </label>
              <input
                type="checkbox"
                id="veg option?"
                className="checkbox"
                name="veg option?"
                value={tiffinVendor["veg option?"]}
                onChange={handleChange}
                checked={tiffinVendor["veg option?"]}
              />
            </div>

            <button className="btn btn-primary" onClick={handleRegister}>
              Register
            </button>
            <h5 className="message">
              Not a Tiffin Vendor?{" "}
              <Link className="pointer" to="/customer/login">
                Customer
              </Link>
            </h5>
            <h5 className="message">
              Already Registered?{" "}
              <Link className="pointer" to="/tiffin-vendor/login">
                Login
              </Link>
            </h5>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TiffinVendorRegister;
