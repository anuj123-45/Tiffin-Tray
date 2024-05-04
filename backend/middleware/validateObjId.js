const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = function (req, res, next) {
  const error = validObjId(req.params.id);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

function validObjId(id) {
  return Joi.objectId().validate(id).error;
}
