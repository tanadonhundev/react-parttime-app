const mongoose = require("mongoose");

const reviewOwnerScheme = mongoose.Schema({
    companyId: String,
    employeeId: String,
    employeeFirstName: String,
    employeeLastName: String,
    workDay: Date,
    employeeRating: Number,
    employeeReviewText: String,
}, { timestamps: true });

module.exports = mongoose.model("ReviewOwner", reviewOwnerScheme);