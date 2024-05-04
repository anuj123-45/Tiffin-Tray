const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided.");
  try {
    const jwtKey = "JNHKOYTOGJNREHUJFJNEJFJTJKGKJGKJGJTJIKGKHGKFKODRL";
    const verified = jwt.verify(token, jwtKey);
    req.data = verified;
    next();
  } catch (ex) {
    res.status(400).send("Token invalid.");
  }
};
