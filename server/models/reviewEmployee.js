const mongoose = require("mongoose");

const reviewEmployeeScheme = mongoose.Schema({
    employeeId: String,
    companyName: String,
    workDay: Date,
    employeeRating: Number,
    employeeReviewText: String,
}, { timestamps: true });

module.exports = mongoose.model("ReviewEmployee", reviewEmployeeScheme);