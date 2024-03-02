const mongoose = require("mongoose");

const reportOwnerScheme = mongoose.Schema({
    companyName: String,
    secReportText: String,
    reportText: String,
    employeeFirstName: String,
    employeeLastName: String,
}, { timestamps: true });

module.exports = mongoose.model("ReportOwner", reportOwnerScheme);