const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("welcome to tiffin_wale.");
});

module.exports = router;
