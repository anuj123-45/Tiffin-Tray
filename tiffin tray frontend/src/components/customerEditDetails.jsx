import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { editCustomer as edit, getCustomer } from "./services/customerService";
import FormInput from "./common/formInput";

import "../styles/auth.css";

function CustomerEditDetails(props) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    password: "",
    area: "",
    city: "",
    pincode: "",
  });
  const { token, isLoggedIn, isCustomer } = props.auth;
  const { updateToken } = props;
  let navigate = useNavigate();
  useEffect(() => {
    async function fetchCustomer() {
      const cust = await getCustomer(token);
      if (cust === null) return;
      if (cust) {
        setCustomer(cust);
      } else navigate("/customer/login");
    }
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = ({ currentTarget: input }) => {
    const cust = { ...customer };
    cust[input.name] = input.value;
    setCustomer(cust);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isLoggedIn && isCustomer) {
      const result = await edit(customer, token, updateToken);
      if (result === true) {
        toast.success("updated successfully");
        navigate("/customer");
      } else if (result) toast.error(result.data);
    } else toast.error("please login again");
  };
  return (
    <div className="card form-card shadow" style={{ width: "600px" }}>
      <div className="card-body">
        <form>
          <h5 className="card-title mb-3">Edit Details</h5>
          <p style={{ textAlign: "left", color: "grey" }}>
            Don't fill up password if you don't want to change it
          </p>
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

          <button className="btn btn-primary" onClick={handleEdit}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerEditDetails;
