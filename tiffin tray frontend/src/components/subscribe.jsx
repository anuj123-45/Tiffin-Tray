import React, { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { getPrice, subscribe } from "./services/subscriptionService";
import "../styles/subscribe.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Subscribe(props) {
  const { monthRate, _id: vendorId, businessName, routine } = props.vendor;
  const { isLoggedIn, isCustomer, token } = props.auth;

  let navigate = useNavigate();
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [days, setDays] = useState(30);

  const handleMealChange = ({ target }) => {
    const currMeal = { ...meals };
    let key = target.name;
    if (typeof key === "undefined") key = target.innerText;
    currMeal[key] = !currMeal[key];
    setMeals(currMeal);
  };

  const handleDaysChange = ({ target }) => {
    setDays(parseInt(target.value) + 30);
  };


  var price = []
  var ans = getPrice(days, monthRate, meals)
  price.push(ans)
  console.log(price);

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51NwojdSEOlkTsKuuK3HYC6rJqJyXPV5PL1E7LUrYDvvHKgq4ZgAbTdrIiMoxHw5PwdpVcfZi6p5ps2qDj9qQbnPv00X4h0GWdL");


    const body = {
      products: price,
    }
    console.log('with' , body);

    const headers = {
      "Content-Type":"application/json"
  }
  const response = await fetch("http://localhost:5000/api/create-checkout-session",{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
  });
    console.log('response',response);
    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id
    });
    

    if (result.error) {
      console.log(result.error);
    }

  }

  




  
  const handleSubscribe = async (e) => {
    if (isLoggedIn && isCustomer) {
      const error = await subscribe(vendorId, meals, days, token);
      if (error) {
        if (error.status === 400)
          toast.error("invalid subscription. please try again");
        else toast.error("please login and try again.");
      } 
      else {
         
          makePayment();
          e.preventDefault();
          toast.success("subscription added successfully")
       
      }

    }
   
  };







 


  return (
    <div className="subscribe">
      <div className="card mx-auto mt-5">
        <div className="card-body px-5 py-4">
          <h3 className="business-name">Subscribe to {businessName}</h3>
          <p className="lead">Breakfast: {routine.breakfast}</p>
          <p className="lead">
            Lunch:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{routine.lunch}
          </p>
          <p className="lead">
            Dinner:&nbsp;&nbsp;&nbsp;&nbsp;{routine.dinner}
          </p>
          <h5 className="card-title mt-4">
            Rs. {monthRate.oldRate}/30days{" "}
            <p className="d-inline fw-lighter">for each meal</p>
          </h5>
          <p className="card-subtitle text-muted mb-5 inline">
            <small>
              <strong className="h5">
                Rs. {monthRate.discountRate}/30days
              </strong>{" "}
              for each meal with minimum subscription of
              <strong className="h5">
                {" "}
                {monthRate.minMonthForNewRate * 30}
              </strong>{" "}
              days.
            </small>
          </p>
          <h6>Choose your meal times</h6>
          {Object.entries(meals).map(([meal, value]) => {
            return (
              <div key={meal} className="form-check">
                <input
                  type="checkbox"
                  name={meal}
                  onChange={handleMealChange}
                  checked={value}
                />
                <label className="form-check-label ms-2" htmlFor={meal}>
                  <p
                    className="fst-italic"
                    name={meal}
                    onClick={handleMealChange}
                  >
                    {meal}
                  </p>
                </label>
              </div>
            );
          })}

          <label htmlFor="days" className="form-label">
            <p className="lead d-inline"> subscription days:</p>{" "}
            <h5 className="d-inline">{days}</h5>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="330"
            step="30"
            value={days - 30}
            onChange={handleDaysChange}
          />
          <div className="row">
            <div className="col-6">
              <h1>Rs. {getPrice(days, monthRate, meals)}</h1>
            </div>
            <div className="col-6 text-end m-auto">
              <button className="btn btn-primary" onClick={handleSubscribe}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
