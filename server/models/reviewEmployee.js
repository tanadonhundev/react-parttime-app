const mongoose = require("mongoose");

const reviewEmployeeScheme = mongoose.Schema({
    employeeId: String,
    employeeRating: Number,
    employeeReviewText: String,
});

module.exports = mongoose.model("ReviewEmployee", reviewEmployeeScheme);