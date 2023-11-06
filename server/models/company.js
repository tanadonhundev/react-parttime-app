const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    companyId: String,
    companyName: String,
    workPosition: String,
    workStartTime: String,
    workEndTime: String,
    workBreakTime: Number,
    dailyWage: Number,
    workDetails: String,
    companyphoto: String
}, { timestamps: true });

module.exports = mongoose.model("Company", userScheme);