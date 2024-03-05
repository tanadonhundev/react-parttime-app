const mongoose = require("mongoose");

const reportScheme = mongoose.Schema({
    reporter: String,
    peopleReporter: String,
    workDay: Date,
    reportText: String,
}, { timestamps: true });

module.exports = mongoose.model("Report", reportScheme);