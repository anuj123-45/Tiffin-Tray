import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTiffinVendorById } from "./services/vendorService";
import { addReview } from "./services/customerService";
import FormInput from "./common/formInput";
import Subscribe from "./subscribe";

import "../styles/tiffinVendorDetails.css";
import _ from "lodash";
const initialReviewState = {
  "stars out of 5": 5,
  title: "",
  details: "",
};
function TiffinVendorDetails(props) {
  const { isLoggedIn, isCustomer, token } = props.auth;
  const [vendor, setVendor] = useState({});
  const [reviewBox, setreviewBox] = useState(false);
  const [review, setReview] = useState(initialReviewState);
  const [render, setRender] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  let navigate = useNavigate();
  let { id } = useParams();
  useEffect(() => {
    async function getTiffinVendor() {
      const vendorDetails = await getTiffinVendorById(id);
      if (vendorDetails === null) return;
      if (vendorDetails === false) {
        toast.error("Tiffin Vendor not found!");
        navigate("/customer");
      } else {
        setVendor(vendorDetails);
      }
    }
    getTiffinVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  const onReviewChange = ({ currentTarget: input }) => {
    const currReview = { ...review };
    currReview[input.name] = input.value;
    setReview(currReview);
  };

  const handleReviewSubmit = async () => {
    if (isLoggedIn && isCustomer) {
      const error = await addReview(review, token, id);
      if (error === null) return null;
      if (error.status && error.status === 400) toast.error("invalid review");
      if (error.status && error.status === 404) toast.error(error.message);
      else if (error === true) {
        setReview(initialReviewState);
        setRender(!render);
        setreviewBox(false);
        toast.success("review added");
      }
    } else toast.error("please login to add review");
  };

  const {
    businessName,
    email,
    phone,
    address,
    rating,
    monthRate,
    routine,
    hasVeg,
  } = vendor;

  if (Object.keys(vendor).length !== 0) {
    if (!subscribe) {
      return (
        <div className="tiffin-vendor-detail mt-5">
          <div className="card shadow-lg px-3 py-2">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <h1 className="business-name">{businessName}</h1>
                </div>
                <div className="col-7" style={{ textAlign: "right" }}>
                  <p className="mb-1">
                    <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                    {email}
                  </p>
                  <p>
                    <i className="fa fa-phone-square" aria-hidden="true"></i>{" "}
                    {phone}
                  </p>
                </div>
              </div>
              <p className={rating.numberOfRatings > 0 ? "d-inline" : "d-none"}>
                Rating:{" "}
              </p>
              <h6
                className={rating.numberOfRatings > 0 ? "d-inline" : "d-none"}
              >
                {rating.numberOfRatings > 0 &&
                  `${_.round(rating.currentRating, 1)}/5`}
              </h6>
              <p
                className={
                  rating.numberOfRatings > 0 ? "d-inline mx-2" : "d-none"
                }
              >
                {rating.numberOfRatings > 0 && `(${rating.numberOfRatings})`}
              </p>
              <div className="row mt-5">
                <div className="col-auto">
                  <h4>Food Routine: </h4>
                </div>
                <div className="col-2">
                  <img
                    className={
                      hasVeg
                        ? "veg-icon my-1 d-block my-2"
                        : "non-veg-icon my-1 d-block my-2"
                    }
                    alt=""
                  />
                </div>
              </div>

              <p className="lead">Breakfast: {routine.breakfast}</p>
              <p className="lead">
                Lunch:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{routine.lunch}
              </p>
              <p className="lead">
                Dinner:&nbsp;&nbsp;&nbsp;&nbsp;{routine.dinner}
              </p>

              <div className="row mt-5">
                <div className="col-6">
                  <h3 className="card-title mt-2">
                    Rs. {monthRate.oldRate}/30days
                  </h3>
                  <p className="card-subtitle text-muted mb-3 inline">
                    <small>
                      Get it at{" "}
                      <strong className="h5">
                        Rs. {monthRate.discountRate}/30days
                      </strong>{" "}
                      with minimum subscription of
                      <strong className="h5">
                        {" "}
                        {monthRate.minMonthForNewRate * 30}
                      </strong>{" "}
                      days.
                    </small>
                  </p>
                </div>
                <div className="col-6 my-auto" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-primary mx-3"
                    onClick={() => setSubscribe(true)}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow px-3 py-2">
            <div className="card-body">
              <h4 className="d-inline">Rating and Reviews: </h4>
              <button
                className="btn btn-primary rounded-circle mx-3"
                title="add review"
                onClick={() => setreviewBox(!reviewBox)}
              >
                <i
                  className={!reviewBox ? "fa fa-plus" : "fa fa-minus"}
                  aria-hidden="true"
                ></i>
              </button>
              {reviewBox && (
                <div className="my-3 w-75">
                  <div className="mb-2">
                    <label htmlFor="">
                      <span style={{ color: "red" }}>*</span>Stars:{" "}
                    </label>
                    <select
                      className="form-select w-25"
                      onChange={({ target }) => {
                        const currReview = { ...review };
                        currReview["stars out of 5"] = parseInt(target.value);
                        setReview(currReview);
                      }}
                      value={review["stars out of 5"]}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <label htmlFor="">Title: </label>
                  <FormInput
                    name="title"
                    type="text"
                    value={review.title}
                    onChange={onReviewChange}
                  />
                  <label htmlFor="">Details: </label>
                  <FormInput
                    name="details"
                    type="text"
                    value={review.details}
                    onChange={onReviewChange}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleReviewSubmit}
                  >
                    Add
                  </button>
                </div>
              )}
              {rating.numberOfRatings > 0 ? (
                <div>
                  <h6 className="mt-4 d-inline lead">Average rating: </h6>
                  <h5
                    className={
                      rating.numberOfRatings > 0 ? "d-inline" : "d-none"
                    }
                  >
                    {rating.numberOfRatings > 0 &&
                      `${_.round(rating.currentRating, 1)}/5`}
                  </h5>
                  <p
                    className={
                      rating.numberOfRatings > 0 ? "d-inline mx-2" : "d-none"
                    }
                  >
                    {rating.numberOfRatings > 0 &&
                      `(${rating.numberOfRatings})`}
                  </p>
                </div>
              ) : (
                <p className="lead">No ratings yet!</p>
              )}
              <h5 className="mt-4">Customer Reviews: </h5>

              {rating.customerRatings.length > 0 ? (
                rating.customerRatings.map((customerReview) => {
                  return (
                    <div key={customerReview.customerId}>
                      <div className="card w-100 m-2">
                        <div className="card-body px-5 py-2">
                          <h5 className="d-inline me-3">
                            {customerReview.rating}{" "}
                            <i className="fa fa-star" aria-hidden="true"></i>
                          </h5>
                          {customerReview.review && (
                            <h6>{customerReview.review.title}</h6>
                          )}
                          {customerReview.review && (
                            <p>{customerReview.review.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="lead">No reviews yet!</p>
              )}
              <div className="mt-5 mb-2">
                <h5>Address: </h5>
                {address.area},{address.city}-{address.pincode}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Subscribe vendor={vendor} auth={props.auth} />;
    }
  }
  return null;
}

export default TiffinVendorDetails;
