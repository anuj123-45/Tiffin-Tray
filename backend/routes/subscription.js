const express = require("express");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { customerModel } = require("../models/customer");
const { vendorModel } = require("../models/tiffinVendor");
const {
  subscriptionModel,
  validateSubscription,
} = require("../models/subscription");
const validateObjId = require("../middleware/validateObjId");
const router = express.Router();

router.get("/customer", auth, async (req, res) => {
  const subscriptions = await subscriptionModel.find({
    customerId: req.data._id,
  });
  res.send(subscriptions);
});

router.get("/tiffin-vendor", auth, async (req, res) => {
  const subscriptions = await subscriptionModel.find({
    vendorId: req.data._id,
  });
  res.send(subscriptions);
});

router.post("/add", auth, async (req, res) => {
  const error = validateSubscription(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await customerModel
    .findById(req.data)
    .select("_id name address");
  if (!customer) return res.status(404).send("Customer not available");
  req.body.customerId = customer._id;

  const vendor = await vendorModel
    .findById(req.body.vendorId)
    .select("monthRate pending businessName");
  if (!vendor) return res.status(400).send("invalid vendor id");
  req.body.monthRateForEachOpted = getRate(
    vendor.monthRate,
    req.body.durationDays
  );
  req.body.isAccepted = false;
  req.body.vendorName = vendor.businessName;
  req.body.customerName = customer.name;
  req.body.address = customer.address;

  const { breakfast, lunch, dinner } = req.body.opted;
  if (!breakfast && !lunch && !dinner)
    return res.status(400).send("invalid meal selection");
  const subscription = await subscriptionModel.addSubscription(req.body);
  vendor.pending.push(subscription._id);
  await vendor.save();
  res.send(subscription);
});

router.delete(
  "/customer/delete/:id",
  [auth, validateObjId],
  async (req, res) => {
    const customer = await customerModel.findById(req.data);
    if (!customer) return res.status(404).send("customer not available");

    const subscription = await subscriptionModel.findById(req.params.id);
    if (!subscription) return res.status(404).send("subscription unavailable");
    if (!subscription.customerId.equals(customer._id))
      return res.status(403).send("different customer trying to delete");
    if (!subscription.isAccepted) {
      await vendorModel.updateOne(
        { _id: subscription.vendorId },
        {
          $pull: {
            pending: subscription._id,
          },
        }
      );
    }
    await subscription.delete();
    res.send("subscription removed");
  }
);

router.delete(
  "/tiffin-vendor/delete/:id",
  [auth, validateObjId],
  async (req, res) => {
    const vendor = await vendorModel
      .findById(req.data._id)
      .select("_id pending");
    if (!vendor) return res.status(404).send("vendor not available");
    const subscription = await subscriptionModel.findById(req.params.id);
    if (!subscription) return res.status(404).send("subscription unavailable");
    if (!subscription.vendorId.equals(vendor._id))
      return res.status(403).send("different vendor trying to delete");
    if (!subscription.isAccepted) {
      vendor.pending = vendor.pending.filter(
        (item) => !item.equals(subscription._id)
      );
      await vendor.save();
    }
    await subscription.delete();
    res.send("subscription removed");
  }
);

function getRate(monthRate, durationDays) {
  const monthDuration = durationDays / 30;
  return monthDuration >= monthRate.minMonthForNewRate
    ? monthRate.discountRate
    : monthRate.oldRate;
}

module.exports = router;
