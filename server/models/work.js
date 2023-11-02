const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  employeeFristName: String,
  employeeLastName: String,
  employmentStatus: {
    type: String,
    default: 'รอยืนยัน'
  }
});

const workScheme = mongoose.Schema({
  companyId: String,
  companyName: String,
  workPosition: String,
  workDay: String,
  workStartTime: String,
  workEndTime: String,
  workBreakTime: Number,
  dailyWage: Number,
  numOfEmployee: Number,
  numOfReady: {
    type: Number,
    default: 0
  },
  workDetails: String,
  employees: [employeeSchema],
}, { timestamps: true });

module.exports = mongoose.model("Work", workScheme);