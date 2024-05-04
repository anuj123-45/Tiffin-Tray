import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { clearToken } from "./services/clearJwt";
import { getName } from "./services/customerService";
import { getTiffinVendors } from "./services/vendorService";
import TiffinVendorCard from "./tiffinVendorCard";

import "../styles/customerHome.css";
import { isArray } from "lodash";

function CustomerHome(props) {
  const [name, setName] = useState("Guest");
  const [query, setQuery] = useState(
    sessionStorage.getItem("tiffin_wale_search") || ""
  );
  const [searched, setSearched] = useState(false);
  const [tiffinVendors, setTiffinVendors] = useState([]);
  const [vegFilter, setVegFilter] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default, price, rating
  const { isLoggedIn, isCustomer, token, updateToken } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) return;
    if (isLoggedIn && !isCustomer) {
      clearToken(updateToken);
      return;
    }
    const name = getName(token);
    if (name) setName(name);
    else toast.error("invalid customer");
  }, [isLoggedIn, isCustomer, updateToken, token]);

  const handleSearch = async () => {
    if (query.length > 50) return;
    const res = await getTiffinVendors(query);
    if (res === null) return;
    if (isArray(res)) {
      sessionStorage.setItem("tiffin_wale_search", query);
      setTiffinVendors(res);
      setSearched(true);
    } else toast.error("invalid city or pincode");
  };

  useEffect(() => {
    if (sessionStorage.getItem("tiffin_wale_search")) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vendorsArray = JSON.parse(JSON.stringify(tiffinVendors));
  return (
    <React.Fragment>
      <div id="background" className={!searched ? "bg-height" : ""}>
        <h4 className="greeting"> {`Hi ${name}`}</h4>
        <div className="input-group mb-3 ">
          <input
            type="text"
            className="form-control"
            placeholder="Search by city or pincode"
            value={query}
            onChange={({ currentTarget: input }) => setQuery(input.value)}
          />
          <button
            className="btn btn-primary px-4"
            type="button"
            onClick={handleSearch}
          >
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {vendorsArray.length !== 0 && (
        <div className="container-fluid">
          <div className="my-3">
            Sort By:
            <select
              className="ms-2 me-5"
              onChange={({ target }) => setSortBy(target.value)}
              value={sortBy}
            >
              <option value="default">default</option>
              <option value="price">price</option>
              <option value="rating">average rating</option>
            </select>
            Veg Only?{" "}
            <label className="switch">
              <input
                type="checkbox"
                name="veg filter"
                value={vegFilter}
                checked={vegFilter}
                onChange={({ target }) =>
                  setVegFilter(target.value === "false" ? true : false)
                }
              />
            </label>
          </div>
          <div className="row">
            {vendorsArray
              .sort((a, b) => {
                if (sortBy === "price") {
                  return a.monthRate.oldRate - b.monthRate.oldRate;
                } else if (sortBy === "rating") {
                  return b.rating.currentRating - a.rating.currentRating;
                }
                return 0;
              })
              .filter((vendor) => {
                if (vegFilter === false) return true;
                if (vendor.hasVeg === true) return true;
                return false;
              })
              .map((vendor) => {
                return <TiffinVendorCard key={vendor._id} vendor={vendor} />;
              })}
          </div>
        </div>
      )}
      {searched && tiffinVendors.length === 0 && (
        <h1>No tiffin vendors found!</h1>
      )}
    </React.Fragment>
  );
}

export default CustomerHome;
