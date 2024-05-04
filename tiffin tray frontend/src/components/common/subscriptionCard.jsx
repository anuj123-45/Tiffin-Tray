import React from "react";
import { useNavigate } from "react-router-dom";
import { getMealCount } from "../services/subscriptionService";
function SubscriptionCard(props) {
  const { isCustomer, subscription, onCancel, onApprove } = props;
  let navigate = useNavigate();
  const {
    _id,
    vendorName,
    customerName,
    durationDays,
    monthRateForEachOpted,
    address,
    opted,
    vendorId,
    isAccepted,
    startDate,
    endDate,
  } = subscription;
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5
          className={isCustomer ? "pointer name" : "name"}
          onClick={
            isCustomer ? () => navigate(`/customer/vendor/${vendorId}`) : null
          }
        >
          {isCustomer ? vendorName : customerName}
        </h5>
        <h6 className="d-inline">Meals Opted : </h6>
        <p className="d-inline lead">{opted.breakfast && "breakfast"} </p>
        <p className="d-inline lead">{opted.lunch && "lunch"} </p>
        <p className="d-inline lead">{opted.dinner && "dinner"} </p>
        <div className="mt-1 mb-4">
          <h6 className="d-inline">Address: </h6>
          <p className="d-inline w-75">
            {address.area},{address.city}-{address.pincode}
          </p>
        </div>

        <p className="mt-3 mb-1">
          Status:{" "}
          <span className="fst-italic h6">
            {isAccepted ? "approved" : "pending"}
          </span>
        </p>
        {!isAccepted && (
          <div className="mt-1 mb-4">
            <h6 className="d-inline">Duration : </h6>
            <p className="d-inline w-75">{`${durationDays / 30} months`}</p>
          </div>
        )}
        <p className="mb-1">
          {isAccepted &&
            `Start Date: ${new Date(startDate).toLocaleDateString("en-GB")}`}
        </p>
        <p className="mb-4">
          {isAccepted &&
            `End Date: ${new Date(endDate).toLocaleDateString("en-GB")}`}
        </p>
        <div className="row">
          <div className="col-5">
            <h4 className="d-inline">
              Rs.{" "}
              <span>
                {(durationDays / 30) *
                  monthRateForEachOpted *
                  getMealCount(opted)}
              </span>
            </h4>
          </div>
          {!isAccepted || new Date(subscription.endDate) >= new Date() ? (
            <div className="col-7 text-end">
              {!isCustomer && !isAccepted && (
                <button
                  className="btn btn-warning me-2"
                  onClick={() => onApprove(_id)}
                >
                  Approve
                </button>
              )}
              <button className="btn btn-danger" onClick={() => onCancel(_id)}>
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionCard;
