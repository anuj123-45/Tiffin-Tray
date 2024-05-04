const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
Joi.objectId = require("joi-objectid")(Joi);

const tiffinVendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
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
  phone: {
    type: String,
    length: 10,
    required: true,
  },
  rating: {
    numberOfRatings: { type: Number, required: true },
    currentRating: { type: Number, required: true },
    customerRatings: [
      {
        rating: { type: Number },
        customerId: { type: mongoose.Schema.Types.ObjectId },
        review: {
          title: {
            type: String,
            minlength: 3,
            maxlength: 50,
          },
          text: {
            type: String,
            minlength: 3,
            maxlength: 255,
          },
        },
      },
    ],
  },
  monthRate: {
    oldRate: {
      type: Number,
      min: 100,
      max: 200000,
    },
    discountRate: {
      type: Number,
      min: 100,
      max: 200000,
    },
    minMonthForNewRate: {
      type: Number,
      min: 2,
      max: 12,
    },
  },
  routine: {
    breakfast: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    lunch: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    dinner: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
  },
  pending: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  hasVeg: {
    type: Boolean,
    default: false,
  },
});



tiffinVendorSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, businessName: this.businessName }, "JNHKOYTOGJNREHUJFJNEJFJTJKGKJGKJGJTJIKGKHGKFKODRL");
};

tiffinVendorSchema.statics.register = async function (
  details,
  propertiesToPick
) {
  const newVendor = new this(_.pick(details, propertiesToPick));
  newVendor.rating.numberOfRatings = 0;
  newVendor.rating.currentRating = 0;
  await newVendor.save();
  return newVendor;
};

tiffinVendorSchema.methods.updateDetails = async function (details) {
  this.businessName = details.businessName;
  this.email = details.email;
  if (details.password) this.password = details.password;
  this.address = _.pick(details.address, ["area", "city", "pincode"]);
  this.phone = details.phone;
  this.monthRate = _.pick(details.monthRate, [
    "oldRate",
    "discountRate",
    "minMonthForNewRate",
  ]);
  this.routine = _.pick(details.routine, ["breakfast", "lunch", "dinner"]);
  this.hasVeg = details.hasVeg;
  await this.save();
};

tiffinVendorSchema.methods.updateRating = async function (
  requestRating,
  custId
) {
  const newRating = _.pick(requestRating, [
    "rating",
    "review.title",
    "review.text",
  ]);
  newRating.customerId = custId;
  const rating = this.rating;
  let oldCustRating = 0;
  for (let i = 0; i < rating.customerRatings.length; i++) {
    const curr = rating.customerRatings[i];
    if (curr.customerId.equals(newRating.customerId)) {
      oldCustRating = curr.rating;
      rating.customerRatings[i] = newRating;
      break;
    }
  }

  rating.currentRating = getCurrRating(
    rating.numberOfRatings,
    rating.currentRating,
    oldCustRating,
    parseInt(newRating.rating)
  );
  if (oldCustRating === 0) {
    rating.customerRatings.push(newRating);
    rating.numberOfRatings++;
  }
  await this.save();
  return newRating;
};

tiffinVendorSchema.methods.acceptSubscription = async function (
  subscriptionId
) {
  let isSubcriptionPresent = false;
  this.pending = this.pending.filter((item) => {
    if (!isSubcriptionPresent && item.equals(subscriptionId)) {
      isSubcriptionPresent = true;
      return false;
    }
    return true;
  });
  await this.save();
  return isSubcriptionPresent;
};

const tiffinVendor = mongoose.model("tiffinVendor", tiffinVendorSchema);

function getCurrRating(
  numberOfRatings,
  currRating,
  oldCustRating,
  newCustRating
) {
  const totalStars = currRating * numberOfRatings,
    diff = newCustRating - oldCustRating;
  if (!oldCustRating) numberOfRatings++;
  return (totalStars + diff) / numberOfRatings;
}

const addressObjJoi = {
  area: Joi.string().trim().min(15).max(255).required(),
  city: Joi.string().trim().min(3).max(50).required(),
  pincode: Joi.string()
    .trim()
    .length(6)
    .regex(/^[0-9]+$/)
    .required(),
};

function validateTiffinVendor(vendor, isRegistering) {
  const addressSchema = Joi.object({
    ...addressObjJoi,
  });
  const rateSchema = Joi.object({
    oldRate: Joi.number().min(100).max(200000).required(),
    discountRate: Joi.number().min(100).max(200000).required(),
    minMonthForNewRate: Joi.number().min(2).max(12).required(),
  });
  const routineSchema = Joi.object({
    breakfast: Joi.string().trim().min(3).max(50).required(),
    lunch: Joi.string().trim().min(3).max(50).required(),
    dinner: Joi.string().trim().min(3).max(50).required(),
  });
  const registerSchema = Joi.object({
    businessName: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255).required(),
    address: addressSchema.required(),
    phone: Joi.string().trim().length(10).required(),
    monthRate: rateSchema.required(),
    routine: routineSchema.required(),
    hasVeg: Joi.boolean().required(),
  });
  const editSchema = Joi.object({
    businessName: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255),
    address: addressSchema.required(),
    phone: Joi.string().trim().length(10).required(),
    monthRate: rateSchema.required(),
    routine: routineSchema.required(),
    hasVeg: Joi.boolean().required(),
  });
  return isRegistering
    ? registerSchema.validate(vendor).error
    : editSchema.validate(vendor).error;
}

function validateLogin(vendor) {
  const schema = Joi.object({
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255).required(),
  });
  return schema.validate(vendor).error;
}

function validateRating(customerRating) {
  const ratingSchema = Joi.object({
    vendorId: Joi.objectId(),
    rating: Joi.number().integer().min(1).max(5).required(),
    review: Joi.object({
      title: Joi.string().trim().min(3).max(50),
      text: Joi.string().trim().min(3).max(255),
    }),
  });
  return ratingSchema.validate(customerRating).error;
}

exports.vendorModel = tiffinVendor;
exports.addressObjJoi = addressObjJoi;
exports.vendorLoginValidate = validateLogin;
exports.vendorValidate = validateTiffinVendor;
exports.ratingValidate = validateRating;
