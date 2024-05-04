const express = require("express");
const cors = require("cors");
const root = require("../routes/root");
const error = require("../middleware/error");
const customer = require("../routes/customer");
const tiffinVendor = require("../routes/tiffinVendor");
const subscription = require("../routes/subscription");

module.exports = function (app) {
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
      exposedHeaders: ["x-auth-token"],
    })
  );
  app.use("/", root);
  app.use("/api/customer", customer);
  app.use("/api/tiffin-vendor", tiffinVendor);
  app.use("/api/subscription", subscription);
  app.use(error);
};
