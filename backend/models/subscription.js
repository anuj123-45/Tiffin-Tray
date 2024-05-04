const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
Joi.objectId = require("joi-objectid")(Joi);

const subscriptionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  vendorName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  monthRateForEachOpted: {
    type: Number,
    min: 100,
    max: 200000,
    required: true,
  },
  opted: {
    breakfast: {
      type: Boolean,
      default: false,
    },
    lunch: {
      type: Boolean,
      default: false,
    },
    dinner: {
      type: Boolean,
      default: false,
    },
  },
  address: {
    area: {
      type: String,
      minlength: 15,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    pincode: {
      type: String,
      length: 6,
      required: true,
    },
  },
  durationDays: {
    type: Number,
    min: 30,
    max: 1000,
    required: true,
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

subscriptionSchema.statics.addSubscription = async function (details) {
  const subscription = new this(
    _.pick(details, [
      "customerId",
      "vendorId",
      "monthRateForEachOpted",
      "opted.breakfast",
      "opted.lunch",
      "opted.dinner",
      "durationDays",
      "address.area",
      "address.city",
      "address.pincode",
      "isAccepted",
      "vendorName",
      "customerName",
    ])
  );
  await subscription.save();
  return subscription;
};
subscriptionSchema.methods.acceptSubscription = async function () {
  const endDate = new Date(),
    startDate = new Date();
  endDate.setDate(startDate.getDate() + this.durationDays);
  (this.startDate = startDate), (this.endDate = endDate);
  this.isAccepted = true;
  this.isPaymentDone = true;
  await this.save();
};





const subscriptionModel = mongoose.model("subscription", subscriptionSchema);

function validateSubscription(sub) {
  const optedSchema = Joi.object({
    breakfast: Joi.boolean().required(),
    lunch: Joi.boolean().required(),
    dinner: Joi.boolean().required(),
  });
  const subSchema = Joi.object({
    vendorId: Joi.objectId().required(),
    opted: optedSchema,
    durationDays: Joi.number().min(30).max(1000).required(),
  });
  return subSchema.validate(sub).error;
}

exports.validateSubscription = validateSubscription;
exports.subscriptionModel = subscriptionModel;
