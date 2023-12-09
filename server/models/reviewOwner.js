const mongoose = require("mongoose");

const reviewOwnerScheme = mongoose.Schema({
    employeeId: String,
    employeeRating: Number,
    employeeReviewText: String,
});

module.exports = mongoose.model("ReviewOwner", reviewOwnerScheme);