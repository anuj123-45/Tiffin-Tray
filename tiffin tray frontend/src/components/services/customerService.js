import jwtDecode from "jwt-decode";
import _ from "lodash";

import config from "../../config.json";
import axios from "../services/axios";

function makeCustomerToSend(customer) {
  const customerToSend = _.pick(customer, ["name", "email", "password"]);
  customerToSend.address = _.pick(customer, ["area", "city", "pincode"]);
  if (customerToSend.password === "") delete customerToSend.password;
  return customerToSend;
}

function makeCustomerToReceive(customer) {
  const customerToReceive = _.pick(customer, ["name", "email"]);
  customerToReceive.password = "";
  customerToReceive.area = customer.address.area;
  customerToReceive.city = customer.address.city;
  customerToReceive.pincode = customer.address.pincode;
  return customerToReceive;
}

function removePrefixesFromError(ex) {
  ex.response.data = ex.response.data.replace("address.", "");
  return ex.response;
}

export function getName(token) {
  try {
    return jwtDecode(token).name;
  } catch (ex) {
    return null;
  }
}

export async function getCustomer(token) {
  try {
    const res = await axios.get(`${config.apiUrl}/customer`, {
      headers: {
        "x-auth-token": token,
      },
    });
    const customerToReceive = makeCustomerToReceive(res.data);
    return customerToReceive;
  } catch (ex) {
    if (ex === null) return null;
    return false;
  }
}

export async function loginCustomer(customer, updateToken) {
  try {
    const res = await axios.post(`${config.apiUrl}/customer/login`, customer);
    updateToken(res.headers["x-auth-token"], true);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    return ex.response;
  }
}

export async function registerCustomer(customer, updateToken) {
  const customerToSend = makeCustomerToSend(customer);
  try {
    const res = await axios.post(
      `${config.apiUrl}/customer/register`,
      customerToSend
    );
    updateToken(res.headers["x-auth-token"], true);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    ex.response = removePrefixesFromError(ex);
    return ex.response;
  }
}

export async function editCustomer(customer, token, updateToken) {
  const customerToSend = makeCustomerToSend(customer);
  try {
    const res = await axios.put(
      `${config.apiUrl}/customer/edit`,
      customerToSend,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    updateToken(res.headers["x-auth-token"], true);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    ex.response = removePrefixesFromError(ex);
    return ex.response;
  }
}

export async function addReview(review, token, id) {
  const reviewToSend = {
    vendorId: id,
    rating: review["stars out of 5"],
    review: {
      title: review.title,
      text: review.details,
    },
  };
  if (reviewToSend.review.title === "" && reviewToSend.review.text === "")
    delete reviewToSend.review;
  try {
    await axios.post(`${config.apiUrl}/tiffin-vendor/review`, reviewToSend, {
      headers: {
        "x-auth-token": token,
      },
    });
    return true;
  } catch (ex) {
    if (ex === null) return null;
    return ex.response;
  }
}
