const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  vendorModel,
  addressObjJoi,
  vendorLoginValidate,
  vendorValidate,
  ratingValidate,
} = require("../models/tiffinVendor");
const { customerModel } = require("../models/customer");
const auth = require("../middleware/auth");
const { subscriptionModel } = require("../models/subscription");
const validateObjId = require("../middleware/validateObjId");
const router = express.Router();

router.get("/pincode/:pincode", async (req, res) => {
  const error = addressObjJoi.pincode.validate(req.params.pincode).error;
  if (error) return res.status(400).send(error.details[0].message);

  const vendors = await vendorModel
    .find({ "address.pincode": req.params.pincode })
    .select(
      "businessName rating.numberOfRatings rating.currentRating monthRate hasVeg"
    );
  res.send(vendors);
});

router.get("/city/:city", async (req, res) => {
  const city = req.params.city.toLowerCase();
  const error = addressObjJoi.city.validate(city).error;
  if (error) return res.status(400).send(error.details[0].message);

  const vendors = await vendorModel
    .find({ "address.city": city })
    .select(
      "businessName rating.numberOfRatings rating.currentRating monthRate hasVeg"
    );
  res.send(vendors);
});

router.get("/:id", validateObjId, async (req, res) => {
  const vendor = await vendorModel
    .findById(req.params.id)
    .select("-password -pending -__v");
  if (!vendor) return res.status(404).send("vendor not found");
  res.send(vendor);
});

router.get("/", auth, async (req, res) => {
  const vendor = await vendorModel
    .findById(req.data)
    .select("-__v, -_id, -password");
  if (!vendor) return res.status(404).send("vendor not found");
  res.send(vendor);
});

router.post("/register", async (req, res) => {
  const error = vendorValidate(req.body, true);
  if (error) return res.status(400).send(error.details[0].message);

  const vendor = await vendorModel
    .findOne({ email: req.body.email })
    .select("_id");
  if (vendor) return res.status(409).send("Vendor is already registered.");
  let propertiesToPick = [
    "businessName",
    "email",
    "address.area",
    "address.city",
    "address.pincode",
    "phone",
    "monthRate.oldRate",
    "monthRate.discountRate",
    "monthRate.minMonthForNewRate",
    "routine.breakfast",
    "routine.lunch",
    "routine.dinner",
    "hasVeg",
    "password",
  ];
  req.body.password = await bcrypt.hash(req.body.password, 10);

  req.body.address.city = req.body.address.city.toLowerCase();
  const newVendor = await vendorModel.register(req.body, propertiesToPick);
  const token = newVendor.generateAuthToken();
  propertiesToPick.pop(); // remove last element from array i.e. password
  res.header("x-auth-token", token).send(_.pick(newVendor, propertiesToPick));
});

router.post("/login", async (req, res) => {
  const error = vendorLoginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const vendor = await vendorModel
    .findOne({ email: req.body.email })
    .select("_id password businessName");
  if (!vendor) return res.status(400).send("invalid email or password");

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    vendor.password
  );
  if (!isPasswordCorrect)
    return res.status(400).send("invalid email or password");

  const token = vendor.generateAuthToken();
  res.header("x-auth-token", token).send();
});

router.put("/edit", auth, async (req, res) => {
  const error = vendorValidate(req.body, false);
  if (error) return res.status(400).send(error.details[0].message);

  let vendor = await vendorModel.findOne({ email: req.body.email });
  if (vendor && !vendor._id.equals(req.data._id)) {
    return res.status(409).send("email is already in use.");
  }
  if (req)
    if (req.body.password)
      req.body.password = await bcrypt.hash(req.body.password, 10);
  vendor = await vendorModel
    .findById(req.data._id)
    .select("-pending -rating -__v");
  req.body.address.city = req.body.address.city.toLowerCase();
  await vendor.updateDetails(req.body);
  const token = vendor.generateAuthToken();
  res.header("x-auth-token", token).send();
});

router.post("/review", auth, async (req, res) => {
  const error = ratingValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await customerModel.findById(req.data).select("_id");
  if (!customer) return res.status(404).send("customer does not exist");

  const vendor = await vendorModel.findById(req.body.vendorId);
  if (!vendor) return res.status(404).send("Tiffin vendor unavailable");

  const newRating = await vendor.updateRating(req.body, req.data._id);
  res.send(newRating);
});

router.put(
  "/accept-subscription/:id",
  [auth, validateObjId],
  async (req, res) => {
    const vendor = await vendorModel.findById(req.data._id).select("pending");
    if (!vendor) return res.status(404).send("vendor not available");
    const isSubscriptionAccepted = await vendor.acceptSubscription(
      req.params.id
    );
    if (!isSubscriptionAccepted)
      return res.status(404).send("subscription is not pending");

    const subscription = await subscriptionModel.findById(req.params.id);
    if (!subscription)
      return res.status(404).send("subscription is not available");
    await subscription.acceptSubscription();
    res.send(subscription);
  }
);

module.exports = router;
