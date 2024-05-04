import React, { useEffect, useState } from "react";

import {
  getCustomerSubscriptions,
  cancelSubscription,
} from "./services/subscriptionService";

import "../styles/subscriptions.css";
import { toast } from "react-toastify";
import SubscriptionCard from "./common/subscriptionCard";

function CustomerSubscriptions(props) {
  const { token, isCustomer, isLoggedIn } = props.auth;
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function getSubscriptions() {
      if (isLoggedIn && isCustomer) {
        const fetchedSubscriptions = await getCustomerSubscriptions(token);
        setSubscriptions(fetchedSubscriptions);
      }
    }
    getSubscriptions();
  }, [isLoggedIn, isCustomer, token]);

  const handleCancel = async (id) => {
    if (isLoggedIn && isCustomer) {
      const err = await cancelSubscription(id, token, true);
      if (err === null) return;
      if (err === false) return toast.error(`couldn't delete subscription`);
      toast.success("cancelled successfully");
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    }
  };
  const subscriptionsToShow = subscriptions
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
          isCustomer={true}
          onCancel={handleCancel}
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
      {subscriptionsToShow.length ? (
        subscriptionsToShow
      ) : (
        <h1>No subscriptions</h1>
      )}
    </div>
  );
}

export default CustomerSubscriptions;
