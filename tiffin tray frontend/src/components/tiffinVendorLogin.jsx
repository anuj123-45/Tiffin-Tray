import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginTiffinVendor as login } from "./services/vendorService";
import FormInput from "./common/formInput";

import { clearToken } from "./services/clearJwt";
import "../styles/auth.css";

function TiffinVendorLogin(props) {
  const [account, setAccount] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  useEffect(() => {
    clearToken(props.updateToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = ({ currentTarget: input }) => {
    const acc = { ...account };
    acc[input.name] = input.value;
    setAccount(acc);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(account, props.updateToken);
    if (result === true) navigate("/tiffin-vendor");
    else if (result) toast.error(result.data);
  };

  return (
    <React.Fragment>
      <div className="card form-card shadow-lg">
        <div className="card-body">
          <form>
            <h5 className="card-title mb-5">Tiffin Vendor Login</h5>
            <FormInput
              value={account.name}
              type="email"
              name="email"
              onChange={handleChange}
            />
            <FormInput
              value={account.password}
              type="password"
              name="password"
              onChange={handleChange}
            />
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
            <h5 className="message">
              Not a Tiffin Vendor?{" "}
              <Link className="pointer" to="/customer/login">
                Customer
              </Link>
            </h5>
            <h5 className="message">
              Not Registered?{" "}
              <Link className="pointer" to="/tiffin-vendor/register">
                Register
              </Link>
            </h5>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TiffinVendorLogin;
