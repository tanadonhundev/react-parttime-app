const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  employeeFristName: String,
  employeeLastName: String,
  employeeAvatar: String,
  employmentStatus: {
    type: String,
    default: 'รอคัดเลือก'
  }
});

const workScheme = mongoose.Schema({
  companyId: String,
  companyName: String,
  workPosition: String,
  workDay: String,
  workStartTime: Date,
  workEndTime: Date,
  workBreakTime: Number,
  dailyWage: Number,
  numOfEmployee: Number,
  workScope: String,
  workWelfare: String,
  workDress: String,
  numOfReady: {
    type: Number,
    default: 0
  },
  companyphoto: String,
  employees: [employeeSchema],
}, { timestamps: true });

module.exports = mongoose.model("Work", workScheme);