const mongoose = require("mongoose");

// const mongoDbUrl = config.get("mongoDb");
module.exports = function () {
  mongoose.connect("mongodb+srv://anuj_1358:Sc7H56ZBksq68suM@devtown.3dsdhuu.mongodb.net/Tiffin").then(()=>console.log(`Connected to database`));
};
