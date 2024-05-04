const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");

const customerSchema = new mongoose.Schema({
  name: {
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
});

// const jwtKey = config.get("jwtKey");

customerSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, name: this.name }, "JNHKOYTOGJNREHUJFJNEJFJTJKGKJGKJGJTJIKGKHGKFKODRL");
};

customerSchema.statics.register = async function (details, propertiesToPick) {
  const newCustomer = new this(_.pick(details, propertiesToPick));
  await newCustomer.save();
  return newCustomer;
};

customerSchema.methods.updateDetails = async function (details) {
  this.name = details.name;
  this.email = details.email;
  if (details.password) this.password = details.password;
  this.address = _.pick(details.address, ["area", "city", "pincode"]);
  await this.save();
};

const customer = mongoose.model("customer", customerSchema);

const loginValidate = (customer) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255),
  });
  return schema.validate(customer).error;
};

function customerValidate(customer, isRegistering) {
  const addressSchema = Joi.object({
    area: Joi.string().trim().min(15).max(255).required(),
    city: Joi.string().trim().min(3).max(50).required(),
    pincode: Joi.string()
      .trim()
      .length(6)
      .regex(/^[0-9]+$/)
      .required(),
  });
  const registerSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255).required(),
    address: addressSchema.required(),
  });
  const editSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().min(3).max(50).required(),
    password: Joi.string().trim().min(3).max(255),
    address: addressSchema.required(),
  });
  return isRegistering
    ? registerSchema.validate(customer).error
    : editSchema.validate(customer).error;
}

exports.customerLoginValidate = loginValidate;
exports.customerValidate = customerValidate;
exports.customerModel = customer;
