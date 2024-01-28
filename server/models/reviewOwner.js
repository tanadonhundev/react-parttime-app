const mongoose = require("mongoose");

const reviewOwnerScheme = mongoose.Schema({
    companyId: String,
    employeeFirstName: String,
    employeeLastName: String,
    workDay: Date,
    rating: Number,
    reviewText: String,
}, { timestamps: true });

module.exports = mongoose.model("ReviewOwner", reviewOwnerScheme);