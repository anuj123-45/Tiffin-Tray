import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./common/formInput";

import { clearToken } from "./services/clearJwt";
import { loginCustomer as login } from "./services/customerService";

import "../styles/auth.css";
import { toast } from "react-toastify";

function CustomerLogin(props) {
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
    if (result === true) navigate("/customer");
    else if (result) toast.error(result.data);
  };

  return (
    <React.Fragment>
      <div className="card form-card shadow-lg">
        <div className="card-body">
          <form>
            <h5 className="card-title mb-5">Customer Login</h5>
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
              Not a Customer?{" "}
              <Link className="pointer" to="/tiffin-vendor/login">
                Tiffin Vendor
              </Link>
            </h5>
            <h5 className="message">
              Not Registered?{" "}
              <Link className="pointer" to="/customer/register">
                Register
              </Link>
            </h5>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CustomerLogin;
