import { getMealCount } from "./subscriptionService";

export function createData(subscriptions) {
  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthRevenue = {};
  let subCount = 0;
  subscriptions.forEach((sub) => {
    if (sub.isAccepted) {
      const startDate = new Date(sub.startDate);
      if (isWithin6months(startDate)) {
        subCount++;
        const subMonth = startDate.toLocaleString("default", { month: "long" });
        if (typeof monthRevenue[subMonth] === "undefined")
          monthRevenue[subMonth] = 0;
        monthRevenue[subMonth] += getSubAmount(sub);
      }
    }
  });
  let monthRevenueArray = Object.keys(monthRevenue);
  monthRevenueArray.sort(
    (a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b)
  );
  return [
    monthRevenueArray.map((month) => {
      return { label: month, y: monthRevenue[month] };
    }),
    subCount,
  ];
}

function isWithin6months(startDate) {
  const currDate = new Date();
  currDate.setDate(1);
  currDate.setHours(0);
  currDate.setMinutes(0);
  currDate.setSeconds(0);
  currDate.setMilliseconds(0);
  currDate.setMonth(currDate.getMonth() - 5);
  return startDate >= currDate;
}

function getSubAmount(sub) {
  const { durationDays, monthRateForEachOpted, opted } = sub;
  return (durationDays / 30) * monthRateForEachOpted * getMealCount(opted);
}
