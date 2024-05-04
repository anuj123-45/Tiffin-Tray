import jwtDecode from "jwt-decode";

import config from "../../config.json";
import axios from "../services/axios";

function makeTiffinVendorToSend(tiffinVendor) {
  const tiffinVendorToSend = {
    businessName: tiffinVendor["business name"],
    email: tiffinVendor.email,
    password: tiffinVendor.password,
    address: {
      area: tiffinVendor.area,
      city: tiffinVendor.city,
      pincode: tiffinVendor.pincode,
    },
    phone: tiffinVendor.phone,
    monthRate: {
      oldRate: tiffinVendor["monthly rate"],
      discountRate: tiffinVendor["monthly discounted rate"],
      minMonthForNewRate: tiffinVendor["minimum month for discount"],
    },
    routine: {
      breakfast: tiffinVendor["breakfast items"],
      lunch: tiffinVendor["lunch items"],
      dinner: tiffinVendor["dinner items"],
    },
    hasVeg: tiffinVendor["veg option?"],
  };
  if (tiffinVendorToSend.password === "") delete tiffinVendorToSend.password;
  return tiffinVendorToSend;
}

function makeTiffinVendorToReceive(tiffinVendor) {
  const tiffinVendorToReceive = {
    "business name": tiffinVendor.businessName,
    email: tiffinVendor.email,
    password: "",
    area: tiffinVendor.address.area,
    city: tiffinVendor.address.city,
    pincode: tiffinVendor.address.pincode,
    phone: tiffinVendor.phone,
    "monthly rate": tiffinVendor.monthRate.oldRate,
    "monthly discounted rate": tiffinVendor.monthRate.discountRate,
    "minimum month for discount": tiffinVendor.monthRate.minMonthForNewRate,
    "breakfast items": tiffinVendor.routine.breakfast,
    "lunch items": tiffinVendor.routine.lunch,
    "dinner items": tiffinVendor.routine.dinner,
    "veg option?": tiffinVendor.hasVeg,
  };
  return tiffinVendorToReceive;
}

function removePrefixesFromError(ex) {
  ex.response.data = ex.response.data.replace("businessName", "business name");

  ex.response.data = ex.response.data.replace("address.", "");

  ex.response.data = ex.response.data.replace("monthRate.", "");
  ex.response.data = ex.response.data.replace("oldRate", "monthly rate");
  ex.response.data = ex.response.data.replace(
    "discountRate",
    "monthly discounted rate"
  );
  ex.response.data = ex.response.data.replace(
    "minMonthForNewRate",
    "minimum month for discount"
  );

  ex.response.data = ex.response.data.replace("routine.", "");
  ex.response.data = ex.response.data.replace("breakfast", "breakfast items");
  ex.response.data = ex.response.data.replace("lunch", "lunch items");
  ex.response.data = ex.response.data.replace("dinner", "dinner items");
  return ex.response;
}

export function getName(token) {
  try {
    return jwtDecode(token).businessName;
  } catch (ex) {
    return null;
  }
}

export async function getTiffinVendor(token) {
  try {
    const res = await axios.get(`${config.apiUrl}/tiffin-vendor`, {
      headers: {
        "x-auth-token": token,
      },
    });
    const tiffinVendorToReceive = makeTiffinVendorToReceive(res.data);
    return tiffinVendorToReceive;
  } catch (ex) {
    if (ex === null) return null;
    return false;
  }
}

export async function getTiffinVendorById(id) {
  try {
    const res = await axios.get(`${config.apiUrl}/tiffin-vendor/${id}`);
    return res.data;
  } catch (ex) {
    if (ex === null) return null;
    return false;
  }
}

export async function loginTiffinVendor(tiffinVendor, updateToken) {
  try {
    const res = await axios.post(
      `${config.apiUrl}/tiffin-vendor/login`,
      tiffinVendor
    );
    updateToken(res.headers["x-auth-token"], false);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    return ex.response;
  }
}

export async function registerTiffinVendor(tiffinVendor, updateToken) {
  const tiffinVendorToSend = makeTiffinVendorToSend(tiffinVendor);
  try {
    const res = await axios.post(
      `${config.apiUrl}/tiffin-vendor/register`,
      tiffinVendorToSend
    );
    updateToken(res.headers["x-auth-token"], false);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    ex.response = removePrefixesFromError(ex);
    return ex.response;
  }
}

export async function getTiffinVendors(query) {
  try {
    let res;
    isNaN(query)
      ? (res = await axios.get(`${config.apiUrl}/tiffin-vendor/city/${query}`))
      : (res = await axios.get(
          `${config.apiUrl}/tiffin-vendor/pincode/${query}`
        ));
    return res.data;
  } catch (ex) {
    if (ex === null) return null;
    return ex.response;
  }
}

export async function editTiffinVendor(tiffinVendor, token, updateToken) {
  const tiffinVendorToSend = makeTiffinVendorToSend(tiffinVendor);
  try {
    const res = await axios.put(
      `${config.apiUrl}/tiffin-vendor/edit`,
      tiffinVendorToSend,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    updateToken(res.headers["x-auth-token"], false);
    return true;
  } catch (ex) {
    if (ex === null) return null;
    ex.response = removePrefixesFromError(ex);
    return ex.response;
  }
}

export async function approveSubscription(id, token) {
  console.log(id);
  try {
    const res = await axios.put(
      `${config.apiUrl}/tiffin-vendor/accept-subscription/${id}`,
      {},
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return res.data;
  } catch (ex) {
    if (ex === null) return null;
    return false;
  }
}
