import config from "../../config.json";
import axios from "../services/axios";

export function getPrice(days, monthRate, meals) {
  const { oldRate, discountRate, minMonthForNewRate } = monthRate;
  const mealCount = getMealCount(meals);
  let currRate = oldRate,
    currMonths = days / 30;
  if (currMonths >= minMonthForNewRate) currRate = discountRate;
  return mealCount * currRate * currMonths;
}

export function getMealCount(meals) {
  let mealCount = 0;
  for (const prop in meals) {
    if (meals[prop]) mealCount++;
  }
  return mealCount;
}

export async function subscribe(id, meals, days, token) {
  try {
    const subscriptionToAdd = {
      vendorId: id,
      opted: meals,
      durationDays: days,
    };
    console.log(subscriptionToAdd);
    await axios.post(`${config.apiUrl}/subscription/add`, subscriptionToAdd, {
      headers: {
        "x-auth-token": token,
      },
    });
  } catch (ex) {
    if (ex === null) return null;
    return ex.response;
  }
}

export async function getCustomerSubscriptions(token) {
  const subscriptions = await axios.get(
    `${config.apiUrl}/subscription/customer`,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  return subscriptions.data;
}
export async function getTiffinVendorSubscriptions(token) {
  const subscriptions = await axios.get(
    `${config.apiUrl}/subscription/tiffin-vendor`,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  return subscriptions.data;
}

export async function cancelSubscription(id, token, isCustomer) {
  try {
    const url = `${config.apiUrl}/subscription/${
      isCustomer ? "customer" : "tiffin-vendor"
    }/delete/${id}`;
    await axios.delete(url, {
      headers: {
        "x-auth-token": token,
      },
    });
  } catch (ex) {
    if (ex === null) return null;
    return false;
  }
}
