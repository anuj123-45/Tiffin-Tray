import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SubscriptionCard from "./common/subscriptionCard";

import "../styles/subscriptions.css";

import {
  getTiffinVendorSubscriptions,
  cancelSubscription,
} from "./services/subscriptionService";
import { approveSubscription } from "./services/vendorService";

function TiffinVendorSubscriptions(props) {
  const { token, isCustomer, isLoggedIn } = props.auth;
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function getSubscriptions() {
      if (isLoggedIn && !isCustomer) {
        const fetchedSubscriptions = await getTiffinVendorSubscriptions(token);
        setSubscriptions(fetchedSubscriptions);
      }
    }
    getSubscriptions();
  }, [isLoggedIn, isCustomer, token]);

  const handleCancel = async (id) => {
    if (isLoggedIn && !isCustomer) {
      const err = await cancelSubscription(id, token, false);
      if (err === null) return;
      if (err === false) return toast.error(`couldn't delete subscription`);
      toast.success("cancelled successfully");
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    }
  };

  const handleApprove = async (id) => {
    if (isLoggedIn && !isCustomer) {
      const subscription = await approveSubscription(id, token);
      if (subscription === null) return;
      if (subscription === false)
        return toast.error(`couldn't accept subscription`);
      toast.success("subscription approved");
      setSubscriptions(
        subscriptions.map((sub) => {
          return sub._id === subscription._id ? subscription : sub;
        })
      );
    }
  };
  const SubscriptionsToShow = subscriptions
    .filter((subscription) => {
      if (filter === "all") return true;
      if (
        filter === "active" &&
        subscription.isAccepted === true &&
        new Date(subscription.endDate) >= new Date()
      )
        return true;
      if (filter === "pending" && subscription.isAccepted === false)
        return true;
      if (
        filter === "expired" &&
        subscription.isAccepted &&
        new Date(subscription.endDate) < new Date()
      )
        return true;
      return false;
    })
    .map((subscription) => {
      return (
        <SubscriptionCard
          key={subscription._id}
          subscription={subscription}
          isCustomer={false}
          onCancel={handleCancel}
          onApprove={handleApprove}
        />
      );
    });

  return (
    <div className="subscriptions">
      <div className="filter my-5">
        <label htmlFor="filter">Filter subscriptions: </label>
        <select
          className="ms-2 me-5"
          name="filter"
          onChange={({ target }) => setFilter(target.value)}
          value={filter}
        >
          <option value="all">All subscriptions</option>
          <option value="active">Active subscriptions</option>
          <option value="pending">Pending subscriptions</option>
          <option value="expired">Expired subscriptions</option>
        </select>
      </div>
      {SubscriptionsToShow.length ? (
        SubscriptionsToShow
      ) : (
        <h1>No subscriptions</h1>
      )}
    </div>
  );
}

export default TiffinVendorSubscriptions;
